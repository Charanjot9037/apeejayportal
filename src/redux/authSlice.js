import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
name:null,
email:null,
profileImage:null,
role:null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.name=action.payload.name;
      state.email=action.payload.email;
      state.profileImage=action.payload.profileImage;
      state.role=action.payload.role
    },

    logout: (state) => {
      state.user = null;
      state.name = null;
      state.email = null;   
      state.profileImage = null;
      state.role=null;
    },
  },
});

export const { loginSuccess, logout } =
  authSlice.actions;

export default authSlice.reducer;