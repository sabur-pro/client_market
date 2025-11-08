import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ordersApi, Order, OrderFilters, PaginatedOrdersResponse } from '@/lib/api/orders';

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  statusFilter: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | null;
  currentPage: number;
  hasMore: boolean;
  total: number;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  loadingMore: false,
  error: null,
  statusFilter: null,
  currentPage: 1,
  hasMore: true,
  total: 0,
};

export const fetchOrders = createAsyncThunk<PaginatedOrdersResponse, void, { state: { orders: OrdersState } }>(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { statusFilter } = state.orders;
      
      const filters: OrderFilters = {
        page: 1,
        limit: 10,
      };
      
      if (statusFilter) {
        filters.status = statusFilter;
      }
      
      return await ordersApi.getUserOrders(filters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки заказов');
    }
  }
);

export const fetchMoreOrders = createAsyncThunk<PaginatedOrdersResponse, void, { state: { orders: OrdersState } }>(
  'orders/fetchMoreOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { statusFilter, currentPage } = state.orders;
      
      const filters: OrderFilters = {
        page: currentPage + 1,
        limit: 10,
      };
      
      if (statusFilter) {
        filters.status = statusFilter;
      }
      
      return await ordersApi.getUserOrders(filters);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки заказов');
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      return await ordersApi.getOrder(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки заказа');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (_, { rejectWithValue }) => {
    try {
      return await ordersApi.createOrder();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания заказа');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setStatusFilter: (state, action: PayloadAction<'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | null>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.currentPage = action.payload.meta.page;
        state.hasMore = action.payload.meta.hasMore;
        state.total = action.payload.meta.total;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchMoreOrders.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(fetchMoreOrders.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.orders = [...state.orders, ...action.payload.data];
        state.currentPage = action.payload.meta.page;
        state.hasMore = action.payload.meta.hasMore;
        state.total = action.payload.meta.total;
      })
      .addCase(fetchMoreOrders.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
        state.total += 1;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setStatusFilter } = ordersSlice.actions;

export default ordersSlice.reducer;
