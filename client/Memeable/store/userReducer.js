import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginStatus: false,
  userId: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reduxLogin: (state) => {
      state.loginStatus = true;
    },
    reduxLogout: (state) => {
      state.loginStatus = false;
      state.userId = "";
    },
    reduxSetUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { reduxLogin, reduxLogout, reduxSetUserId } = userSlice.actions;

export default userSlice.reducer;
