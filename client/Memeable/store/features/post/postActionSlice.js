import { handleDeletePost, handleUploadPost } from "../../actions/userActions";

export const postActionReducer = (builder) => {
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
    .addCase(handleDeletePost.fulfilled, (state, action) => {
      state.status = "succeeded";
      const deletedPostId = action.meta.arg;
      state.allPosts = state.allPosts.filter(
        (post) => post._id !== deletedPostId
      );
    });
};
