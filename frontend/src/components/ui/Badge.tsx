import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-[rgba(181,181,195,0.1)] text-[#B5B5C3]',
      primary: 'bg-gradient-to-r from-[rgba(123,97,255,0.2)] to-[rgba(255,79,216,0.2)] text-[#7B61FF] border border-[rgba(123,97,255,0.3)]',
      secondary: 'bg-gradient-to-r from-[rgba(91,140,255,0.2)] to-[rgba(110,243,255,0.2)] text-[#5B8CFF] border border-[rgba(91,140,255,0.3)]',
      success: 'bg-green-900/20 text-green-400 border border-green-500/30',
      warning: 'bg-yellow-900/20 text-yellow-400 border border-yellow-500/30',
      danger: 'bg-red-900/20 text-red-400 border border-red-500/30',
      outline: 'border-2 border-[#7B61FF] bg-transparent text-[#7B61FF]',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
