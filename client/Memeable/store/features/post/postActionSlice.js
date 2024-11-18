import { handleDeletePost, handleUploadPost } from "../../actions/userActions";

export const postActionReducer = (builder) => {
  builder
    .addCase(handleUploadPost.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.allPosts = [];
    })
    .addCase(handleDeletePost.fulfilled, (state, action) => {
      state.status = "succeeded";
      const deletedPostId = action.meta.arg;
      state.allPosts = state.allPosts.filter(
        (post) => post._id !== deletedPostId
      );
    });
};
