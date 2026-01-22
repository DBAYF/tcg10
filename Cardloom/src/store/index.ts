import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
import collectionsReducer from './slices/collectionsSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import decksReducer from './slices/decksSlice';
import socialReducer from './slices/socialSlice';
import notificationsReducer from './slices/notificationsSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'app'], // Only persist auth and app state
  blacklist: ['collections', 'marketplace', 'decks', 'social', 'notifications'] // Don't persist dynamic data
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  collections: collectionsReducer,
  marketplace: marketplaceReducer,
  decks: decksReducer,
  social: socialReducer,
  notifications: notificationsReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
  devTools: __DEV__,
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store and persistor
export default store;