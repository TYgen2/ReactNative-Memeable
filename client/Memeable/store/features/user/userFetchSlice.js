import { fetchUserInfo } from "../../actions/userActions";

export const userFetchReducer = (builder) => {
  builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.userDetails = action.payload;
  });
};
