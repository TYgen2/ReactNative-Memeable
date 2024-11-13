import { fetchAllPosts } from "../../actions/userActions";

export const postFetchReducer = (builder) => {
  builder
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
    });
};
