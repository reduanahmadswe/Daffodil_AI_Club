import React from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const imageSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name = 'User', size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    if (src && !imageError) {
      return (
        <div
          ref={ref}
          className={cn(
            'relative rounded-full overflow-hidden',
            sizes[size],
            className
          )}
          style={{ background: 'rgba(123, 97, 255, 0.2)' }}
          {...props}
        >
          <Image
            src={src}
            alt={alt || name}
            width={imageSizes[size]}
            height={imageSizes[size]}
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center rounded-full text-nexus-text font-semibold',
          sizes[size],
          className
        )}
        className="bg-nexus-gradient"
        {...props}
      >
        {getInitials(name)}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
