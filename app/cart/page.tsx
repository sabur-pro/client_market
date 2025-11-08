'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { 
  fetchCart, 
  updateCartItemAsync, 
  removeFromCartAsync 
} from '@/lib/features/cart/cartSlice';
import { createOrder } from '@/lib/features/orders/ordersSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import QuantityControl from '@/components/QuantityControl';
import ImageWithSkeleton from '@/components/ImageWithSkeleton';
import CartItemSkeleton from '@/components/skeletons/CartItemSkeleton';
import { getImageUrl } from '@/lib/utils';

const CartPage: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total, loading, error } = useAppSelector((state) => state.cart);
  const { loading: orderLoading } = useAppSelector((state) => state.orders);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const handleRemove = (itemId: string): void => {
    dispatch(removeFromCartAsync(itemId));
  };

  const handleIncrease = (itemId: string, currentQuantity: number): void => {
    dispatch(updateCartItemAsync({ itemId, quantity: currentQuantity + 1 }));
  };

  const handleDecrease = (itemId: string, currentQuantity: number): void => {
    dispatch(updateCartItemAsync({ itemId, quantity: currentQuantity - 1 }));
  };

  const handleCheckout = async (): Promise<void> => {
    setCheckoutError(null);
    const result = await dispatch(createOrder());
    
    if (createOrder.fulfilled.match(result)) {
      router.push('/orders');
    } else {
      setCheckoutError(result.payload as string || 'Ошибка при оформлении заказа');
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 pb-6 md:pb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Корзина</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <CartItemSkeleton key={index} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-20">
              <CardHeader className="p-4 md:p-6">
                <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 animate-shimmer bg-[length:200%_100%]" />
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-4">
                <div className="space-y-2">
                  <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
                  <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
                </div>
                <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Корзина</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500 text-sm md:text-base">{error}</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => dispatch(fetchCart())} size="sm">
                Попробовать снова
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Корзина</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 text-sm md:text-base">Корзина пуста</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 pb-6 md:pb-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Корзина</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          {items.map((item) => {
            const imageUrl = getImageUrl(item.product.imageUrl);

            return (
              <Card key={item.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex gap-3 md:gap-4">
                    <div className="relative h-20 w-20 md:h-24 md:w-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <ImageWithSkeleton
                        src={imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 80px, 96px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-semibold text-sm md:text-lg line-clamp-2">
                          {item.product.name}
                        </h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(item.id)}
                          disabled={loading}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-gray-600 text-xs md:text-sm mb-2">
                        {item.product.price.toFixed(2)} сомонӣ
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <QuantityControl
                          quantity={item.quantity}
                          onIncrease={() => handleIncrease(item.id, item.quantity)}
                          onDecrease={() => handleDecrease(item.id, item.quantity)}
                          maxQuantity={item.product.stock}
                          loading={loading}
                        />
                        <p className="font-semibold text-sm md:text-lg whitespace-nowrap">
                          {(item.product.price * item.quantity).toFixed(2)} сомонӣ
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-20">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Итого</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Товаров:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Количество:</span>
                  <span className="font-medium">{totalQuantity}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg md:text-xl font-bold">
                    <span>Сумма:</span>
                    <span>{total.toFixed(2)} сомонӣ</span>
                  </div>
                </div>
              </div>
              {checkoutError && (
                <div className="text-red-500 text-xs md:text-sm mb-2">
                  {checkoutError}
                </div>
              )}
              <Button 
                className="w-full mt-4" 
                size="default" 
                disabled={loading || orderLoading}
                onClick={handleCheckout}
              >
                {orderLoading ? 'Оформление...' : 'Оформить заказ'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

