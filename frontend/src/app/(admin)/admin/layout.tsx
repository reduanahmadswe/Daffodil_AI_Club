'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout';
import { useAuthStore } from '@/lib/store';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

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
      <div className="flex min-h-screen">
        <div className="w-64 bg-gray-900 p-4">
          <Skeleton className="h-10 w-10 rounded-xl mb-8" />
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl bg-gray-800" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-950">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
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
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
