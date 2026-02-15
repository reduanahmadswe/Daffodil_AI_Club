'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout';
import { useAppSelector } from '@/lib/redux/hooks';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'ADMIN' && user?.role !== 'EXECUTIVE') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
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
