import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, userApi } from '../../shared/api/endpoints';
import { AxiosError } from 'axios';

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await authApi.login(username, password);
    const { access_token, refresh_token } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    const userResponse = await userApi.getMe();
    return {
      user: userResponse.data,
      access_token,
      refresh_token,
    };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; username: string; password: string; full_name?: string }) => {
    await authApi.register(data);
    const loginResponse = await authApi.login(data.username, data.password);
    const { access_token, refresh_token } = loginResponse.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    const userResponse = await userApi.getMe();
    return {
      user: userResponse.data,
      access_token,
      refresh_token,
    };
  }
);

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!accessToken || !refreshToken) {
    throw new Error('No tokens found');
  }
  
  try {
    const response = await userApi.getMe();
    return {
      user: response.data,
      accessToken,
      refreshToken,
    };
  } catch (error: unknown) {
    if (
      error instanceof AxiosError &&
      error.response?.status === 401
    ) {
      try {
        const refreshResponse = await authApi.refresh(refreshToken);
        const { access_token: newAccessToken, refresh_token: newRefreshToken } = refreshResponse.data;
        
        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);
        
        const userResponse = await userApi.getMe();
        return {
          user: userResponse.data,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw refreshError;
      }
    }
    throw error;
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return null;
});

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await authApi.refresh(refreshToken);
    const { access_token, refresh_token } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    return { access_token, refresh_token };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      localStorage.setItem('access_token', action.payload.access_token);
      localStorage.setItem('refresh_token', action.payload.refresh_token);
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
        state.isAuthenticated = false;
        state.user = null;
      })
      // Check auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      // Refresh token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { clearError, setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
