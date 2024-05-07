import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    isAuthenticated: false,
    loading: false,
    user: null,
    errors: null,
  },
  reducers: {
    getSignupRequest(state) {
      state.loading = true;
    },
    getSignupDetails(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    getLoginRequest(state) {
      state.loading = true;
    },
    getLoginDetails(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    getError(state, action) {
      state.errors = action.payload;
      state.loading = false;
    },
    getCurrentUserRequest(state) {
      state.loading = true;
    },

    getCurrentUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    getLogoutRequest(state) {
      state.loading = true;
    },
    getLogout(state, action) {
      state.user = action.payload;
      state.isAuthenticated = false;
      state.loading = false;
    },

    clearError(state) {
      state.errors = null;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
