import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  department: "",
  designation: "",
};

const mentorSlice = createSlice({
  name: "mentor",

  initialState,

  reducers: {
    setMentorProfile: (state, action) => {
      const data = action.payload || {};

      state.id = data.id || null;
      state.department = data.department || "";
      state.designation = data.designation || "";
    },

    clearMentorProfile: (state) => {
      state.id = null;
      state.department = "";
      state.designation = "";
    },
  },
});

export const {
  setMentorProfile,
  clearMentorProfile,
} = mentorSlice.actions;

export default mentorSlice.reducer;