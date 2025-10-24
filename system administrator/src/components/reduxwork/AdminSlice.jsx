import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  AdminData: {},
  isLogin: false,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    login: (state, action) => {
      state.AdminData = action.payload;
      state.isLogin = true;
    },
    logout: (state) => {
      state.AdminData = {};
      state.isLogin = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
