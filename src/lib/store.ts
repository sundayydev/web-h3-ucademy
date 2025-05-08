import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authReducer';

const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      token: savedToken,
      isLoggedIn: !!savedToken,
      user: null
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
