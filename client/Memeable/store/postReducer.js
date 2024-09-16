import { createSlice } from "@reduxjs/toolkit";
import { fetchPosts, handleUploadPost } from "./userActions";

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
    builder
      .addCase(handleUploadPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleUploadPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allPosts.unshift(action.payload.postData);
      })
      .addCase(handleUploadPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newPosts = action.payload.postData;
        const limit = action.meta.arg.limit;

        if (action.payload.reset) {
          if (newPosts.length > limit) {
            state.allPosts = newPosts;
          } else {
            state.allPosts = [...newPosts, ...state.allPosts];
          }
        } else {
          state.allPosts = [...state.allPosts, ...action.payload.postData];
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { clearPosts } = postSlice.actions;

export default postSlice.reducer;
