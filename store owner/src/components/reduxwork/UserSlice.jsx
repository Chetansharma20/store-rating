import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  StoreOwner: {},
  isLogin: false,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    login: (state, action) => {
      state.StoreOwner = action.payload;
      state.isLogin = true;
    },
    logout: (state) => {
      state.StoreOwner = {};
      state.isLogin = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
