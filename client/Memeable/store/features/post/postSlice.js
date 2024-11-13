import { createSlice } from "@reduxjs/toolkit";
import { postFetchReducer } from "./postFetchSlice";
import { postActionReducer } from "./postActionSlice";
import { postUpdateReducer } from "./postUpdateSlice";

const initialState = {
  allPosts: [],
  status: "idle",
  error: null,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearPosts: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    postFetchReducer(builder);
    postActionReducer(builder);
    postUpdateReducer(builder);
  },
});

export const { clearPosts } = postSlice.actions;
export default postSlice.reducer;
