import { handleUploadPost } from "../../actions/userActions";

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
    });
};
