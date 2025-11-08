'use client';

import { FC, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { checkAuthAsync } from '@/lib/features/auth/authSlice';

const protectedRoutes = ['/products', '/cart', '/orders', '/profile'];
const authRoutes = ['/login', '/register', '/welcome'];

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const AuthChecker: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getCookie('access_token') || localStorage.getItem('access_token');
      if (token && !isAuthenticated && !loading) {
        dispatch(checkAuthAsync());
      }
    }
  }, [dispatch, isAuthenticated, loading]);

  useEffect(() => {
    if (loading) return; // Don't redirect while checking auth

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Redirect to login if trying to access protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
      const token = typeof window !== 'undefined' 
        ? (getCookie('access_token') || localStorage.getItem('access_token'))
        : null;
      if (!token) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }

    if (isAuthRoute && isAuthenticated) {
      router.push('/products');
    }

    if (pathname === '/') {
      if (!isAuthenticated) {
        router.push('/welcome');
      } else {
        router.push('/products');
      }
    }
  }, [pathname, isAuthenticated, loading, router]);

  return null;
};

export default AuthChecker;

