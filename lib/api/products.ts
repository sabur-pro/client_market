import { apiClient } from './client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  costPrice: number;
  imageUrl: string | null;
  category: string | null;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const getUniqueCategories = (products: Product[]): string[] => {
  const categories = products
    .map((p) => p.category)
    .filter((cat): cat is string => cat !== null && cat.trim() !== '');
  return Array.from(new Set(categories)).sort();
};

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice !== null && filters?.minPrice !== undefined) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters?.maxPrice !== null && filters?.maxPrice !== undefined) {
      params.append('maxPrice', filters.maxPrice.toString());
    }
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
} as const;
