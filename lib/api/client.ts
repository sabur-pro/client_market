import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://135.125.182.46:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = getCookie('client_access_token') || localStorage.getItem('client_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor with refresh token logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[Auth] Received 401 error, checking tokens...');
      if (originalRequest.url?.includes('/auth/refresh')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('client_access_token');
          localStorage.removeItem('client_refresh_token');
          localStorage.removeItem('user');
          
          document.cookie = 'client_access_token=; path=/; max-age=0';
          document.cookie = 'client_refresh_token=; path=/; max-age=0';
          
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = typeof window !== 'undefined' 
        ? (getCookie('client_refresh_token') || localStorage.getItem('client_refresh_token'))
        : null;

      if (!refreshToken) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('client_access_token');
          localStorage.removeItem('user');
          
          document.cookie = 'client_access_token=; path=/; max-age=0';
          document.cookie = 'client_refresh_token=; path=/; max-age=0';
          
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        console.log('[Auth] Attempting to refresh access token...');
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
          }
        );

        const { access_token, refresh_token } = response.data;

        if (!access_token || !refresh_token) {
          throw new Error('Invalid token response');
        }

        console.log('[Auth] Token refresh successful');

        if (typeof window !== 'undefined') {
          localStorage.setItem('client_access_token', access_token);
          localStorage.setItem('client_refresh_token', refresh_token);
          
          document.cookie = `client_access_token=${access_token}; path=/; max-age=${60 * 1}`; 
          document.cookie = `client_refresh_token=${refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}`; 
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        processQueue(null, access_token);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (err: any) {
        console.error('[Auth] Token refresh failed:', err.response?.status, err.message);
        processQueue(err as Error, null);
        isRefreshing = false;

        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('[Auth] Refresh token invalid, redirecting to login');
          if (typeof window !== 'undefined') {
            localStorage.removeItem('client_access_token');
            localStorage.removeItem('client_refresh_token');
            localStorage.removeItem('user');
            
            document.cookie = 'client_access_token=; path=/; max-age=0';
            document.cookie = 'client_refresh_token=; path=/; max-age=0';
            
            window.location.href = '/login';
          }
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

