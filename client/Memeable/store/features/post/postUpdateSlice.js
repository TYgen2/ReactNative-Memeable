import { handleUpdateIcon } from "../../actions/userActions";

export const postUpdateReducer = (builder) => {
  builder.addCase(handleUpdateIcon.fulfilled, (state, action) => {
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
  });
};
