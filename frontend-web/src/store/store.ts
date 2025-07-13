import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import bookingReducer from './slices/bookingSlice.js';
import authReducer from './slices/authSlice.js';
import organizationReducer from './slices/organizationSlice.js';
import notificationReducer from './slices/notificationSlice.js';
// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'booking'] // Persist auth and booking state
};

// Combine reducers
const rootReducer = combineReducers({
  booking: bookingReducer,
  auth: authReducer,
  organization: organizationReducer,
  notification: notificationReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with Redux Toolkit
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
      },
    }),
  devTools: true, // Enable Redux DevTools
});

// Create persistor
export const persistor = persistStore(store);

// Export store types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
