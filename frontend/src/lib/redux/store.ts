import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import notificationReducer from './slices/notificationSlice';
import { notificationMiddleware } from './middleware/notificationMiddleware';

// Persist config for auth
const authPersistConfig = {
  key: 'auth-storage',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'], // Only persist these fields
};

// Persist config for theme
const themePersistConfig = {
  key: 'theme-storage',
  storage,
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

// Combine reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  theme: persistedThemeReducer,
  notification: notificationReducer, // No persistence for notifications
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(notificationMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store, {}, () => {
  // Callback after rehydration - set hasHydrated flag
  store.dispatch({ type: 'auth/setHasHydrated', payload: true });
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
