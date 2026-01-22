import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, LoginForm, RegisterForm } from '../../types';
import { STORAGE_KEYS } from '../../constants';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginForm, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate authentication
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        displayName: 'Test User',
        email: credentials.email,
        avatarUrl: '',
        bio: 'TCG enthusiast',
        location: 'New York, NY',
        memberSince: new Date().toISOString(),
        tradingStats: {
          totalTrades: 25,
          sellerRating: 4.8,
          reviewCount: 20,
          successfulTrades: 23,
        },
        preferences: {
          theme: 'dark',
          defaultGame: 'pokemon',
          currency: 'USD',
          notifications: {
            offers: true,
            priceDrops: true,
            followers: true,
            events: true,
            messages: true,
            marketing: false,
          },
          privacy: {
            profileVisibility: 'public',
            collectionVisibility: 'followers',
            onlineStatus: true,
            lastActiveVisible: true,
            locationVisible: true,
            messagePermissions: 'anyone',
          },
        },
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.auth.token, mockToken);
      await AsyncStorage.setItem(STORAGE_KEYS.auth.user, JSON.stringify(mockUser));

      return { user: mockUser, token: mockToken };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterForm, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const mockUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        displayName: userData.displayName,
        email: userData.email,
        avatarUrl: '',
        bio: '',
        location: '',
        memberSince: new Date().toISOString(),
        tradingStats: {
          totalTrades: 0,
          sellerRating: 0,
          reviewCount: 0,
          successfulTrades: 0,
        },
        preferences: {
          theme: 'system',
          defaultGame: userData.preferredGames[0] || 'pokemon',
          currency: 'USD',
          notifications: {
            offers: true,
            priceDrops: true,
            followers: true,
            events: true,
            messages: true,
            marketing: false,
          },
          privacy: {
            profileVisibility: 'public',
            collectionVisibility: 'private',
            onlineStatus: true,
            lastActiveVisible: true,
            locationVisible: false,
            messagePermissions: 'anyone',
          },
        },
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.auth.token, mockToken);
      await AsyncStorage.setItem(STORAGE_KEYS.auth.user, JSON.stringify(mockUser));

      return { user: mockUser, token: mockToken };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.auth.token);
      await AsyncStorage.removeItem(STORAGE_KEYS.auth.user);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would refresh the JWT token
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.auth.token);
      if (!storedToken) {
        throw new Error('No token found');
      }

      // Simulate token refresh
      const newToken = 'refreshed-jwt-token-' + Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.auth.token, newToken);

      return newToken;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const loadStoredAuth = createAsyncThunk(
  'auth/loadStored',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.auth.token);
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.auth.user);

      if (!token || !userJson) {
        return { user: null, token: null };
      }

      const user = JSON.parse(userJson);
      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load stored auth');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })

      // Load Stored Auth
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loadStoredAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

// Export actions
export const { setUser, setToken, setError, clearError, updateUser } = authSlice.actions;

// Export selectors
export const selectAuth = (state: any) => state.auth;
export const selectUser = (state: any) => state.auth.user;
export const selectToken = (state: any) => state.auth.token;
export const selectIsAuthenticated = (state: any) => !!state.auth.token;
export const selectAuthLoading = (state: any) => state.auth.isLoading;
export const selectAuthError = (state: any) => state.auth.error;

// Export reducer
export default authSlice.reducer;