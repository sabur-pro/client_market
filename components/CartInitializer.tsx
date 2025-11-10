'use client';

import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCart } from '@/lib/features/cart/cartSlice';

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const CartInitializer: FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getCookie('client_access_token') || localStorage.getItem('client_access_token');
      if (token && isAuthenticated) {
        dispatch(fetchCart());
      }
    }
  }, [dispatch, isAuthenticated]);

  return null;
};

export default CartInitializer;

