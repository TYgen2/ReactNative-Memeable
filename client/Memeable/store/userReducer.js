import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginStatus: false,
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
    },
  },
});

// Action creators are generated for each case reducer function
export const { reduxLogin, reduxLogout } = userSlice.actions;

export default userSlice.reducer;
