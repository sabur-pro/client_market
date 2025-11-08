import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, User, LoginDto, RegisterDto } from '@/lib/api/auth';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginDto, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        document.cookie = `access_token=${response.access_token}; path=/; max-age=${60 * 1}`; 
        document.cookie = `refresh_token=${response.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}`; 
      }
      
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: RegisterDto, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        document.cookie = `access_token=${response.access_token}; path=/; max-age=${60 * 1}`;
        document.cookie = `refresh_token=${response.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        document.cookie = 'access_token=; path=/; max-age=0';
        document.cookie = 'refresh_token=; path=/; max-age=0';
      }
      
      return null;
    } catch (error: any) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        document.cookie = 'access_token=; path=/; max-age=0';
        document.cookie = 'refresh_token=; path=/; max-age=0';
      }
      return null;
    }
  }
);

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window !== 'undefined') {
        const token = getCookie('access_token') || localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          const profile = await authApi.getProfile();
          return profile;
        }
      }
      return rejectWithValue('Not authenticated');
    } catch (error: any) {
      return rejectWithValue('Not authenticated');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { resetError, setUser } = authSlice.actions;

export default authSlice.reducer;

