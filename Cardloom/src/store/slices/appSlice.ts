import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TCGGame } from '../../types';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  lastSync: string | null;
  selectedGame: TCGGame | null;
  onboardingCompleted: boolean;
  searchQuery: string;
  isLoading: boolean;
}

const initialState: AppState = {
  theme: 'system',
  isOnline: true,
  lastSync: null,
  selectedGame: null,
  onboardingCompleted: false,
  searchQuery: '',
  isLoading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setLastSync: (state, action: PayloadAction<string>) => {
      state.lastSync = action.payload;
    },
    setSelectedGame: (state, action: PayloadAction<TCGGame | null>) => {
      state.selectedGame = action.payload;
    },
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboardingCompleted = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetAppState: (state) => {
      state.searchQuery = '';
      state.selectedGame = null;
    },
  },
});

export const {
  setTheme,
  setOnlineStatus,
  setLastSync,
  setSelectedGame,
  setOnboardingCompleted,
  setSearchQuery,
  setLoading,
  resetAppState,
} = appSlice.actions;

export const selectTheme = (state: any) => state.app.theme;
export const selectIsOnline = (state: any) => state.app.isOnline;
export const selectLastSync = (state: any) => state.app.lastSync;
export const selectSelectedGame = (state: any) => state.app.selectedGame;
export const selectOnboardingCompleted = (state: any) => state.app.onboardingCompleted;
export const selectSearchQuery = (state: any) => state.app.searchQuery;
export const selectAppLoading = (state: any) => state.app.isLoading;

export default appSlice.reducer;