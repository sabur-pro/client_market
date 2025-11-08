'use client';

import { FC, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface ImageWithSkeletonProps extends Omit<ImageProps, 'onLoad'> {
  skeletonClassName?: string;
}

const ImageWithSkeleton: FC<ImageWithSkeletonProps> = ({
  className,
  skeletonClassName,
  alt,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse',
            'bg-[length:200%_100%]',
            skeletonClassName
          )}
          style={{
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}
      <Image
        {...props}
        alt={alt}
        className={cn(
          'transition-opacity duration-500',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={() => setIsLoading(false)}
      />
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageWithSkeleton;
