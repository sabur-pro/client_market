'use client';

import { FC, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const BottomCartBar: FC = () => {
  const router = useRouter();
  const { items, total } = useAppSelector((state) => state.cart);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  if (items.length === 0) {
    return null;
  }

  const handleGoToCart = () => {
    router.push('/cart');
  };

  return (
    <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-[60] p-2 md:p-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
      <Card className="max-w-7xl mx-auto shadow-lg pointer-events-auto">
        <div className="p-2 md:p-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative">
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  <span className="hidden sm:inline">Товаров в корзине: </span>
                  <span className="font-semibold">{totalItems} шт.</span>
                </p>
                <p className="text-sm md:text-lg font-bold">
                  {total.toFixed(2)} сомонӣ
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleGoToCart}
              className="gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-10 px-3 md:px-4"
              aria-label="Перейти в корзину"
            >
              <span className="hidden sm:inline">Перейти в </span>
              Корзину
              <ArrowRight className="h-3 w-3 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BottomCartBar;

