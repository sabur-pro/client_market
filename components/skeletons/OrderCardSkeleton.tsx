import { FC } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OrderCardSkeletonProps {
  className?: string;
}

const OrderCardSkeleton: FC<OrderCardSkeletonProps> = ({ className }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 md:h-5 md:w-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
              <div className="h-5 md:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-32 animate-shimmer bg-[length:200%_100%]" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 animate-shimmer bg-[length:200%_100%]" />
              <div className="h-3 w-1 bg-gray-300 rounded-full" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 animate-shimmer bg-[length:200%_100%]" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 animate-shimmer bg-[length:200%_100%]" />
              <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-28 animate-shimmer bg-[length:200%_100%]" />
            </div>
          </div>

          <div className="h-8 w-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
        </div>
      </CardHeader>
    </Card>
  );
};

export default OrderCardSkeleton;
