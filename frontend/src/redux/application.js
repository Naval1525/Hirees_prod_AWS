import { createSlice } from "@reduxjs/toolkit";


const applicaationSlice = createSlice({
  name: "Application",
  initialState: {
    applicants:[],
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },

  },
});


export const { setAllApplicants } = applicaationSlice.actions;
export default applicaationSlice.reducer;

