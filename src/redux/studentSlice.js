import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  studentId: null,
  userId: null,
  profileImage: "",
  department: "",
  program: "",
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudentProfile: (state, action) => {
      const { studentId, userId, profileImage, department, program } =
        action.payload;

      state.studentId = studentId;
      state.userId = userId;
      state.profileImage = profileImage;
      state.department = department;
      state.program = program;
    },

    clearStudentProfile: (state) => {
      state.studentId = null;
      state.userId = null;
      state.profileImage = "";
      state.department = "";
      state.program = "";
    },
  },
});

export const { setStudentProfile, clearStudentProfile } = studentSlice.actions;

export default studentSlice.reducer;
