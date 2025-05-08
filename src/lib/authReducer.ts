import { createSlice } from '@reduxjs/toolkit';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = true;
      if (action.payload?.token) {
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
      }
    },
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload && typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload);
      }
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
});

export const { setUser, setIsLoggedIn, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
