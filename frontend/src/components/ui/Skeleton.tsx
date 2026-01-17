import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', ...props }, ref) => {
    const variants = {
      text: 'h-4 rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-lg',
      card: 'h-48 rounded-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gray-200 dark:bg-gray-700',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Card skeleton for loading states
export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
    <Skeleton className="h-40 mb-4" variant="rectangular" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex gap-2 mt-4">
      <Skeleton className="h-6 w-16" variant="rectangular" />
      <Skeleton className="h-6 w-16" variant="rectangular" />
    </div>
  </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
  <div className="flex items-center gap-4">
    <Skeleton className="w-12 h-12" variant="circular" />
    <div className="flex-1">
      <Skeleton className="h-5 w-32 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);
