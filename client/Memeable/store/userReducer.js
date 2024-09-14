import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo, handleFollow } from "./userActions";

const initialState = {
  loginStatus: false,
  userDetails: {},
  userPosts: [],
  status: "idle",
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reduxLogin: (state) => {
      state.loginStatus = true;
    },
    reduxLogout: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userDetails = action.payload.userDetails;
        state.userPosts = action.payload.userPosts;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(handleFollow.fulfilled, (state, action) => {
        const followAction = action.meta.arg.action;
        if (followAction === "follow") {
          state.userDetails.followingCount += 1;
        } else if (followAction === "unfollow") {
          state.userDetails.followingCount -= 1;
        }
        console.log(action.payload.msg);
      })
      .addCase(handleFollow.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { reduxLogin, reduxLogout } = userSlice.actions;

export default userSlice.reducer;
