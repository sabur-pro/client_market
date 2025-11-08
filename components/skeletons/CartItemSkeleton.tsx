import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CartItemSkeletonProps {
  className?: string;
}

const CartItemSkeleton: FC<CartItemSkeletonProps> = ({ className }) => {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-3 md:p-4">
        <div className="flex gap-3 md:gap-4">
          <div className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
          
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 space-y-2">
                <div className="h-5 md:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
                <div className="h-5 md:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-shimmer bg-[length:200%_100%]" />
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
            </div>
            
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 animate-shimmer bg-[length:200%_100%]" />
            
            <div className="flex items-center justify-between gap-2">
              <div className="h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 animate-shimmer bg-[length:200%_100%]" />
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 animate-shimmer bg-[length:200%_100%]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItemSkeleton;
