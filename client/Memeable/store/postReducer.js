import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllPosts,
  handleUpdateIcon,
  handleUploadPost,
} from "./userActions";

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
        state.allPosts = [];
      })
      .addCase(handleUploadPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAllPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { postData, reset } = action.payload;

        // refresh mode
        if (reset) {
          state.allPosts = postData;
        } else {
          // initial fetch & load more fetch, append more fetched
          // posts to the end of current allPosts
          state.allPosts = [...state.allPosts, ...postData];
        }
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(handleUpdateIcon.fulfilled, (state, action) => {
        state.status = "succeeded";
        const userId = action.payload.user;
        const modifiedIcon = action.payload.updatedIcon.customIcon;

        state.allPosts = state.allPosts.map((post) => {
          if (post.userId._id === userId) {
            post.userId.icon.customIcon = modifiedIcon;
            return post;
          }
          return post;
        });
      })
      .addCase(handleUpdateIcon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { clearPosts } = postSlice.actions;

export default postSlice.reducer;
