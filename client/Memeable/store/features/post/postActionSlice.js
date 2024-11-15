import {
  handleDeletePost,
  handleSavePost,
  handleUploadPost,
  handleLikePost,
} from "../../actions/userActions";

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
    })
    .addCase(handleSavePost.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { postId, saveAction } = action.payload;

      state.allPosts = state.allPosts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            isSaved: saveAction === "save",
          };
        }
        return post;
      });
    })
    .addCase(handleLikePost.fulfilled, (state, action) => {
      state.status = "succeeded";
      const { postId, likeAction } = action.payload;

      state.allPosts = state.allPosts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            hasLiked: likeAction === "like",
            likes: likeAction === "like" ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      });
    });
};
