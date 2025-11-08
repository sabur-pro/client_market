import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, productsApi, getUniqueCategories, ProductFilters, PaginatedResponse } from '@/lib/api/products';

export interface ProductsFilters {
  search: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface ProductsState {
  items: Product[];
  categories: string[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  filters: ProductsFilters;
  currentPage: number;
  hasMore: boolean;
  total: number;
}

const initialState: ProductsState = {
  items: [],
  categories: [],
  loading: false,
  loadingMore: false,
  error: null,
  filters: {
    search: '',
    category: null,
    minPrice: null,
    maxPrice: null,
  },
  currentPage: 1,
  hasMore: true,
  total: 0,
};

export const fetchProducts = createAsyncThunk<PaginatedResponse<Product>, void, { state: { products: ProductsState } }>(
  'products/fetchProducts',
  async (_, { getState }) => {
    const state = getState();
    const { filters } = state.products;

    const params: ProductFilters = {
      search: filters.search || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      page: 1,
      limit: 20,
    };

    return await productsApi.getAll(params);
  }
);

export const fetchMoreProducts = createAsyncThunk<PaginatedResponse<Product>, void, { state: { products: ProductsState } }>(
  'products/fetchMoreProducts',
  async (_, { getState }) => {
    const state = getState();
    const { filters, currentPage } = state.products;

    const params: ProductFilters = {
      search: filters.search || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      page: currentPage + 1,
      limit: 20,
    };

    return await productsApi.getAll(params);
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
    },
    setPriceFilter: (
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>
    ) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.currentPage = action.payload.meta.page;
        state.hasMore = action.payload.meta.hasMore;
        state.total = action.payload.meta.total;
        state.categories = getUniqueCategories(action.payload.data);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить товары';
      })
      .addCase(fetchMoreProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.items = [...state.items, ...action.payload.data];
        state.currentPage = action.payload.meta.page;
        state.hasMore = action.payload.meta.hasMore;
        state.total = action.payload.meta.total;
        state.categories = getUniqueCategories(state.items);
      })
      .addCase(fetchMoreProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message || 'Не удалось загрузить больше товаров';
      });
  },
});

export const {
  setSearchFilter,
  setCategoryFilter,
  setPriceFilter,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;

