import { FC } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProductCardSkeletonProps {
  className?: string;
}

const ProductCardSkeleton: FC<ProductCardSkeletonProps> = ({ className }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative h-48 md:h-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
      <CardContent className="p-3 md:p-4 flex flex-col flex-grow space-y-3">
        <div className="space-y-2">
          <div className="h-5 md:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
          <div className="h-5 md:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-shimmer bg-[length:200%_100%]" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3 animate-shimmer bg-[length:200%_100%]" />
        </div>
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <div className="h-6 md:h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 animate-shimmer bg-[length:200%_100%]" />
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 animate-shimmer bg-[length:200%_100%]" />
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 md:p-4 md:pt-0 mt-auto">
        <div className="h-9 md:h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full animate-shimmer bg-[length:200%_100%]" />
      </CardFooter>
    </Card>
  );
};

export default ProductCardSkeleton;
