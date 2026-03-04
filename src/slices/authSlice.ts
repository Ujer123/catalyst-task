import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '@/types';

const initialState: AuthState = { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setLoggedIn, setUser } = authSlice.actions;
export default authSlice.reducer;
