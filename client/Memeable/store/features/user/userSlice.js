import { createSlice } from "@reduxjs/toolkit";
import { userFetchReducer } from "./userFetchSlice";
import { userActionReducer } from "./userActionSlice";
import { userUpdateReducer } from "./userUpdateSlice";

const initialState = {
  loginStatus: false,
  userDetails: {},
  status: "idle",
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reduxLogin: (state) => {
      state.loginStatus = true;
    },
    reduxLogout: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    userFetchReducer(builder);
    userActionReducer(builder);
    userUpdateReducer(builder);
  },
});

export const { reduxLogin, reduxLogout } = userSlice.actions;
export default userSlice.reducer;
