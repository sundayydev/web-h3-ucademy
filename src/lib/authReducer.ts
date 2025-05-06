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
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

export const { setUser, setIsLoggedIn, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
