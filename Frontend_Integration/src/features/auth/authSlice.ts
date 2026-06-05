import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser, LoginCredentials } from '../../types/auth.types';
import { mapLoginDataToAuthUser } from '../../types/auth.types';
import { loginApi, logoutApi } from '../../services/auth/authApiService';
import { saveAuthUser, getAuthUser, clearAuthUser } from '../../localStorage/localAuthStorage';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk<AuthUser, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      if (response.success && response.data) {
        const user = mapLoginDataToAuthUser(response.data, credentials.email);
        await saveAuthUser(user);
        return user;
      }
      return rejectWithValue('Login failed: Invalid server response structure');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      await clearAuthUser();
    } catch (error: any) {
      console.error('Error in logoutThunk:', error);
      // Even if API logout fails, we clear the local user session to avoid stuck state
      await clearAuthUser();
      const message = error.response?.data?.message || error.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

export const hydrateAuthThunk = createAsyncThunk<AuthUser | null, void, { rejectValue: string }>(
  'auth/hydrate',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getAuthUser();
      return user;
    } catch (error: any) {
      console.error('Error in hydrateAuthThunk:', error);
      const message = error.message || 'Failed to restore auth session';
      return rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginThunk
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      // logoutThunk
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Logout failed';
      })
      // hydrateAuthThunk
      .addCase(hydrateAuthThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hydrateAuthThunk.fulfilled, (state, action: PayloadAction<AuthUser | null>) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(hydrateAuthThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || 'Hydration failed';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;