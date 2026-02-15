import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-nexus-text-secondary/10 text-nexus-text-secondary',
      primary: 'bg-gradient-to-r from-nexus-purple/20 to-nexus-pink/20 text-nexus-purple border border-nexus-purple/30',
      secondary: 'bg-gradient-to-r from-nexus-blue/20 to-nexus-cyan/20 text-nexus-blue border border-nexus-blue/30',
      success: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30',
      warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
      danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30',
      outline: 'border-2 border-nexus-purple bg-transparent text-nexus-purple',
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
