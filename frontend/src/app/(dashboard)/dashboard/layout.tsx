'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updateUser } from '@/lib/redux/slices/authSlice';
import { authApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, hasHydrated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Re-fetch profile to catch role/membership changes (e.g. after admin approval)
  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      authApi.getProfile().then((res) => {
        const profile = res.data.data || res.data;
        if (profile && user) {
          // Update Redux if role or membershipStatus changed
          if (profile.role !== user.role || profile.membershipStatus !== user.membershipStatus) {
            dispatch(updateUser({
              role: profile.role,
              membershipStatus: profile.membershipStatus,
            }));
            // Update cookie for middleware routing
            if (typeof window !== 'undefined') {
              document.cookie = `auth-role=${profile.role}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            }
          }
        }
      }).catch(() => {
        // Silently ignore — network error or token expired
      });
    }
  }, [hasHydrated, isAuthenticated]);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      window.location.href = '/login';
    } else if (hasHydrated && isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'EXECUTIVE')) {
      window.location.href = '/admin';
    }
  }, [isAuthenticated, hasHydrated, user]);

  // Wait for client-side hydration
  if (!mounted || !hasHydrated) {
    return (
      <div className="flex min-h-screen bg-nexus-bg">
        <div className="w-64 glass border-r border-nexus-border p-4">
          <Skeleton className="h-10 w-10 rounded-xl mb-8" style={{ background: 'rgba(123, 97, 255, 0.2)' }} />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" style={{ background: 'rgba(123, 97, 255, 0.1)' }} />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-8" style={{ background: 'rgba(123, 97, 255, 0.2)' }} />
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" style={{ background: 'rgba(123, 97, 255, 0.1)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-nexus-surface-1">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
