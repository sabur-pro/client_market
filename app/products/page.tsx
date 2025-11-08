'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchProducts, fetchMoreProducts } from '@/lib/features/products/productsSlice';
import ProductFilters from '@/components/ProductFilters';
import ProductList from '@/components/ProductList';
import BottomCartBar from '@/components/BottomCartBar';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, loadingMore, categories, error, hasMore } = useAppSelector(
    (state) => state.products
  );

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loadingMore && hasMore && items.length > 0) {
        dispatch(fetchMoreProducts());
      }
    },
    [loadingMore, hasMore, items.length, dispatch]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);

  return (
    <>
      <div className="container mx-auto px-4 py-6 pb-32 md:pb-32">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Товары</h1>

        <ProductFilters categories={categories} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base">
            {error}
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="animate-fade-in">
              <ProductList products={items} categories={categories} />
            </div>
            
            <div ref={observerTarget} className="w-full py-4">
              {loadingMore && (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>

            {!hasMore && items.length > 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                Все товары загружены
              </div>
            )}
          </>
        )}
      </div>

      <BottomCartBar />
    </>
  );
}

