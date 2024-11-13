import { fetchUserInfo } from "../../actions/userActions";

export const userFetchReducer = (builder) => {
  builder
    .addCase(fetchUserInfo.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails = action.payload;
    })
    .addCase(fetchUserInfo.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
};
