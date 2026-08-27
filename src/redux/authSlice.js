import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    name: null,
    email: null,
    role: null,
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },

    updateUser: (state, action) => {
      state.user.email = action.payload.email;
      state.user.name = action.payload.name;
    },

    logout: (state) => {
      state.user = null;
      state.name = null;
      state.email = null;
      state.role = null;
    },
  },
});
export const { loginSuccess, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
