import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginStatus: false,
  userInfo: null,
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
      state.userInfo = null;
    },
    reduxSetUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { reduxLogin, reduxLogout, reduxSetUserInfo } = userSlice.actions;

export default userSlice.reducer;
