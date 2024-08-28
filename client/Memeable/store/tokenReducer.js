import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jwtToken: null,
  refreshToken: null,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setJwt: (state, action) => {
      state.jwtToken = action.payload;
    },
    setRefresh: (state, action) => {
      state.refreshToken = action.payload;
    },
    clearToken: (state) => {
      state.jwtToken = null;
      state.refreshToken = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setJwt, setRefresh, clearToken } = tokenSlice.actions;

export default tokenSlice.reducer;
