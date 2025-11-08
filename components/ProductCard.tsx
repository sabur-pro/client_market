'use client';

import { FC, useCallback, useMemo } from 'react';
import { Product } from '@/lib/api/products';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addToCartAsync, updateCartItemAsync } from '@/lib/features/cart/cartSlice';
import QuantityControl from './QuantityControl';
import ImageWithSkeleton from './ImageWithSkeleton';
import { getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  readonly product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.cart);

  // Найти товар в корзине
  const cartItem = useMemo(
    () => items.find((item) => item.productId === product.id),
    [items, product.id]
  );

  const handleAddToCart = useCallback(() => {
    dispatch(addToCartAsync({ productId: product.id, quantity: 1 }));
  }, [dispatch, product.id]);

  const handleIncrease = useCallback(() => {
    if (cartItem) {
      dispatch(updateCartItemAsync({ 
        itemId: cartItem.id, 
        quantity: cartItem.quantity + 1 
      }));
    }
  }, [dispatch, cartItem]);

  const handleDecrease = useCallback(() => {
    if (cartItem) {
      dispatch(updateCartItemAsync({ 
        itemId: cartItem.id, 
        quantity: cartItem.quantity - 1 
      }));
    }
  }, [dispatch, cartItem]);

  const imageUrl = getImageUrl(product.imageUrl);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative h-48 md:h-56 bg-gray-100 flex-shrink-0">
        <ImageWithSkeleton
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-3 md:p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm md:text-lg mb-2 line-clamp-2 h-10 md:h-14">
          {product.name}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2 h-8 md:h-10">
          {product.description || '\u00A0'}
        </p>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="text-lg md:text-xl font-bold whitespace-nowrap">{product.price.toFixed(2)} сом.</span>
          {product.stock > 0 ? (
            <Badge variant="default" className="text-[10px] md:text-xs px-2 py-0.5 flex-shrink-0">В наличии</Badge>
          ) : (
            <Badge variant="destructive" className="text-[10px] md:text-xs px-2 py-0.5 flex-shrink-0">Нет</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 md:p-4 md:pt-0 mt-auto">
        {cartItem ? (
          <div className="w-full flex justify-center">
            <QuantityControl
              quantity={cartItem.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              maxQuantity={product.stock}
              loading={loading}
            />
          </div>
        ) : (
          <Button
            className="w-full h-9 md:h-10 text-xs md:text-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || loading}
            aria-label={`Добавить ${product.name} в корзину`}
          >
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            В корзину
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

