import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types/interfaces.js';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  canCreateOrganization: null,
  canJoinOrganization: null,

};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Login success - store user and token
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string, canCreateOrganization: boolean, canJoinOrganization: boolean  }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.canCreateOrganization = action.payload.canCreateOrganization;
      state.canJoinOrganization = action.payload.canJoinOrganization;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Signup success - same as login
    signupSuccess: (state, action: PayloadAction<{ user: User; token: string; canCreateOrganization?: boolean; canJoinOrganization?: boolean }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.canCreateOrganization = action.payload.canCreateOrganization ?? true; // Default to true for new users
      state.canJoinOrganization = action.payload.canJoinOrganization ?? true; // Default to true for new users
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Logout - clear everything
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.canCreateOrganization=null;
      state.canJoinOrganization=null;
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Update token and user data (for JWT refresh)
    updateAuthData: (state, action: PayloadAction<{ user?: User; token?: string; canCreateOrganization?: boolean; canJoinOrganization?: boolean }>) => {
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      if (action.payload.token) {
        state.token = action.payload.token;
      }
      if (action.payload.canCreateOrganization !== undefined) {
        state.canCreateOrganization = action.payload.canCreateOrganization;
      }
      if (action.payload.canJoinOrganization !== undefined) {
        state.canJoinOrganization = action.payload.canJoinOrganization;
      }
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  signupSuccess,
  setError,
  clearError,
  logout,
  updateUser,
  updateAuthData,
} = authSlice.actions;

export default authSlice.reducer;
