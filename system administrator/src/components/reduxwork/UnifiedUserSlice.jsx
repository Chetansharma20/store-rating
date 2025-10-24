import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null, // 'admin', 'store_owner', or 'user'
  isLogin: false,
};

const unifiedUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isLogin = true;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isLogin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});

export const { login, logout } = unifiedUserSlice.actions;
export default unifiedUserSlice.reducer;