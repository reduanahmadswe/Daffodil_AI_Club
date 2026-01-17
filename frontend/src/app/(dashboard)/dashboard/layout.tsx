'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/layout';
import { useAuthStore } from '@/lib/store';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen" style={{ background: '#000000' }}>
        <div className="w-64 glass border-r border-[rgba(255,255,255,0.1)] p-4">
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
    <div className=\"flex min-h-screen\" style={{ background: '#0B0B12' }}>
      <DashboardSidebar />
      <main className=\"flex-1 ml-64 p-8\">{children}</main>
    </div>
  );
}
