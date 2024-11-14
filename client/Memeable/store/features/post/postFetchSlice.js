import { getTimeDifference } from "../../../utils/helper";
import { fetchAllPosts } from "../../actions/userActions";

export const postFetchReducer = (builder) => {
  builder.addCase(fetchAllPosts.fulfilled, (state, action) => {
    state.status = "succeeded";
    const { postData, reset } = action.payload;

    const postsWithTimeAgo = postData.map((post) => ({
      ...post,
      timeAgo: getTimeDifference(post.createDate),
    }));

    if (reset) {
      state.allPosts = postsWithTimeAgo;
    } else {
      state.allPosts = [...state.allPosts, ...postsWithTimeAgo];
    }
  });
};
