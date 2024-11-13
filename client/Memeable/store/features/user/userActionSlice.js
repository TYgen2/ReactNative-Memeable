import { handleFollow, handleDeletePost } from "../../actions/userActions";

export const userActionReducer = (builder) => {
  builder
    .addCase(handleFollow.pending, (state) => {
      state.status = "loading";
    })
    .addCase(handleFollow.fulfilled, (state, action) => {
      state.status = "succeeded";
      const followAction = action.meta.arg.action;
      if (followAction === "follow") {
        state.userDetails.followingCount += 1;
      } else if (followAction === "unfollow") {
        state.userDetails.followingCount -= 1;
      }
      console.log(action.payload.msg);
    })
    .addCase(handleFollow.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(handleDeletePost.pending, (state) => {
      state.status = "loading";
    })
    .addCase(handleDeletePost.fulfilled, (state) => {
      state.status = "succeeded";
      state.userDetails.postsCount -= 1;
    })
    .addCase(handleDeletePost.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
};
