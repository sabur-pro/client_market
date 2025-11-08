import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi, Cart, CartItem as ApiCartItem } from '@/lib/api/cart';

export interface CartState {
  items: ApiCartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartApi.getCart();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить корзину');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, { rejectWithValue }) => {
    try {
      const cart = await cartApi.addToCart({ productId, quantity });
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось добавить товар в корзину');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const cart = await cartApi.updateCartItem(itemId, { quantity });
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось обновить количество');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const cart = await cartApi.removeFromCart(itemId);
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось удалить товар');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartApi.clearCart();
      return cart;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось очистить корзину');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    clearCartState: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(updateCartItemAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetError, clearCartState } = cartSlice.actions;

export default cartSlice.reducer;

