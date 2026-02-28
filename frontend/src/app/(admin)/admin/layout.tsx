'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useAppSelector } from '@/lib/redux/hooks';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, hasHydrated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && hasHydrated) {
      if (!isAuthenticated) {
        window.location.href = '/login';
      } else if (user?.role !== 'ADMIN' && user?.role !== 'EXECUTIVE') {
        window.location.href = '/dashboard';
      }
    }
  }, [isAuthenticated, hasHydrated, mounted, user]);

  // Wait for client-side hydration before deciding
  if (!mounted || !hasHydrated) {
    return (
      <div className="flex min-h-screen bg-nexus-bg">
        <div className="w-64 p-4 bg-nexus-surface-1">
          <Skeleton className="h-10 w-10 rounded-xl mb-8" style={{ background: 'rgba(123, 97, 255, 0.2)' }} />
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" style={{ background: 'rgba(123, 97, 255, 0.1)' }} />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 bg-nexus-surface-1">
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

  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'EXECUTIVE')) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-nexus-surface-1">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
