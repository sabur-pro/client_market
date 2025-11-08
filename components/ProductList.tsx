'use client';

import { Product } from '@/lib/api/products';
import ProductCard from './ProductCard';
import { FC } from 'react';

interface ProductListProps {
  readonly products: Product[];
  readonly categories: readonly string[];
}

const ProductList: FC<ProductListProps> = ({ products, categories }) => {
  const productsByCategory = categories.map((category) => ({
    category,
    products: products.filter((p) => p.category === category),
  }));

  const uncategorizedProducts = products.filter(
    (p) => !p.category || !categories.includes(p.category)
  );

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Товары не найдены</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {productsByCategory.map(
        ({ category, products: categoryProducts }) =>
          categoryProducts.length > 0 && (
            <div key={category}>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
      )}

      {uncategorizedProducts.length > 0 && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Другие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {uncategorizedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

