import { fetchUserInfo } from "../../actions/userActions";

export const userFetchReducer = (builder) => {
  builder
    .addCase(fetchUserInfo.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails = action.payload;
    });
};
