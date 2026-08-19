import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  studentId: null,
  userId: null,
  profileImage: "",
  department: "",
  program: "",
  academicBatch: "",
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudentProfile: (state, action) => {
      const {
        studentId,
        userId,
        profileImage,
        department,
        program,
        academicBatch,
      } = action.payload;

      state.studentId = studentId;
      state.userId = userId;
      state.profileImage = profileImage;
      state.department = department;
      state.program = program;
      state.academicBatch = academicBatch;
    },

    clearStudentProfile: (state) => {
      state.studentId = null;
      state.userId = null;
      state.profileImage = "";
      state.department = "";
      state.program = "";
      state.academicBatch = "";
    },
  },
});

export const { setStudentProfile, clearStudentProfile } = studentSlice.actions;

export default studentSlice.reducer;
