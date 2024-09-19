import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllPosts,
  handleFollow,
  handleLike,
  handleUpdateIcon,
  handleUploadPost,
} from "./userActions";
import { Alert } from "react-native";

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
        const newPosts = action.payload.postData;
        const limit = action.meta.arg.limit;

        // refresh mode
        if (action.payload.reset) {
          // if the number of fetched new posts are equal to the fetch limit,
          // replace the allPosts to clear cache
          if (newPosts.length === limit) {
            state.allPosts = newPosts;
          } else {
            // append the fetched new posts to the front of current allPosts
            state.allPosts = [...newPosts, ...state.allPosts];
          }
        } else {
          // load more fetch, append more fetch posts to the end of current allPosts
          state.allPosts = [...state.allPosts, ...action.payload.postData];
        }
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(handleFollow.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { targetId } = action.meta.arg;
        const followAction = action.meta.arg.action;

        // remove the unfollowed user's post in allPosts
        if (followAction === "unfollow") {
          state.allPosts = state.allPosts.filter(
            (post) => post.userId._id !== targetId
          );
        } else if (followAction === "follow") {
          state.allPosts = [];
        }
      })
      .addCase(handleFollow.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(handleLike.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { msg, likeAction, postId } = action.payload;
        const post = state.allPosts.find((post) => post._id === postId);

        // update like status
        if (post) {
          post.hasLiked = !post.hasLiked;
        } else {
          Alert.alert(msg);
        }

        // update like count
        if (likeAction === "like") {
          post.likes += 1;
        } else if (likeAction === "unlike") {
          post.likes -= 1;
        } else {
          Alert.alert(msg);
        }
      })
      .addCase(handleLike.rejected, (state, action) => {
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
