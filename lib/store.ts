import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './features/products/productsSlice';
import cartReducer from './features/cart/cartSlice';
import authReducer from './features/auth/authSlice';
import ordersReducer from './features/orders/ordersSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      orders: ordersReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

