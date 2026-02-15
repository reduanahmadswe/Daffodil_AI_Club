import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  uniqueId: string;
  email: string;
  name: string;
  phone?: string;
  department?: string;
  batch?: string;
  studentId?: string;
  profileImage?: string;
  role: 'VISITOR' | 'MEMBER' | 'EXECUTIVE' | 'ADMIN';
  points: number;
  isVerified: boolean;
  qrCode?: string;
  createdAt?: string;
  bio?: string;
  membershipStatus?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  hasHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      // Remove token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHasHydrated: (state, action: PayloadAction<boolean>) => {
      state.hasHydrated = action.payload;
    },
  },
});

export const { login, logout, updateUser, setLoading, setHasHydrated } = authSlice.actions;
export default authSlice.reducer;
