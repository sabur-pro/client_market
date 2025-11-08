'use client';

import { FC, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  setSearchFilter,
  setCategoryFilter,
  setPriceFilter,
  resetFilters,
  fetchProducts,
} from '@/lib/features/products/productsSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

interface ProductFiltersProps {
  readonly categories: readonly string[];
}

const ProductFilters: FC<ProductFiltersProps> = ({ categories }) => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState<string>(filters.search);
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice?.toString() || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setSearchFilter(searchTerm));
        dispatch(fetchProducts());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch, filters.search]);

  const handleCategoryChange = useCallback((value: string): void => {
    const category = value === 'all' ? null : value;
    dispatch(setCategoryFilter(category));
    dispatch(fetchProducts());
  }, [dispatch]);

  const handlePriceFilter = useCallback((): void => {
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    dispatch(setPriceFilter({ min, max }));
    dispatch(fetchProducts());
  }, [dispatch, minPrice, maxPrice]);

  const handleResetFilters = useCallback((): void => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    dispatch(resetFilters());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  }, []);

  const handleMinPriceChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setMinPrice(e.target.value);
  }, []);

  const handleMaxPriceChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    setMaxPrice(e.target.value);
  }, []);

  const hasActiveFilters: boolean =
    Boolean(filters.search) ||
    filters.category !== null ||
    filters.minPrice !== null ||
    filters.maxPrice !== null;

  return (
    <Card className="mb-4 md:mb-6">
      <CardContent className="p-3 md:pt-6 md:px-6 md:pb-6">
        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 h-9 md:h-10 text-sm"
              aria-label="Поиск товаров"
            />
          </div>

          {/* Категория */}
          <Select
            value={filters.category || 'all'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger aria-label="Выбор категории" className="h-9 md:h-10 text-sm">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-2 md:contents">
            <Input
              type="number"
              placeholder="От"
              value={minPrice}
              onChange={handleMinPriceChange}
              min="0"
              step="0.01"
              className="h-9 md:h-10 text-sm"
              aria-label="Минимальная цена"
            />
            <Input
              type="number"
              placeholder="До"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              min="0"
              step="0.01"
              className="h-9 md:h-10 text-sm"
              aria-label="Максимальная цена"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
          <Button onClick={handlePriceFilter} variant="secondary" size="sm" className="h-8 md:h-9 text-xs md:text-sm">
            Применить
          </Button>
          {hasActiveFilters && (
            <Button onClick={handleResetFilters} variant="outline" size="sm" className="h-8 md:h-9 text-xs md:text-sm">
              <X className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Сбросить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;

