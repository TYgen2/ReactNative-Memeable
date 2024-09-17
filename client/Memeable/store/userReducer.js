import { createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import {
  fetchUserInfo,
  handleFollow,
  handleUpdateBgImage,
  handleUpdateIcon,
  handleUpdateStrings,
  handleUploadPost,
} from "./userActions";

const initialState = {
  loginStatus: false,
  userDetails: {},
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
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(handleFollow.fulfilled, (state, action) => {
        state.status = "succeeded";
        const followAction = action.meta.arg.action;
        if (followAction === "follow") {
          state.userDetails.followingCount += 1;
        } else if (followAction === "unfollow") {
          state.userDetails.followingCount -= 1;
        }
        console.log(action.payload.msg);
      })
      .addCase(handleFollow.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(handleUpdateStrings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleUpdateStrings.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedData = action.meta.arg;
        state.userDetails.username = updatedData.username;
        state.userDetails.displayName = updatedData.displayName;
        state.userDetails.userBio = updatedData.userBio;
      })
      .addCase(handleUpdateStrings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        if (action.payload.errorType === "validation") {
          Alert.alert("Input data invalid:", action.payload.invalidData[0].msg);
        } else if (action.payload.errorType === "duplicate") {
          Alert.alert("Updated failed:", action.payload.msg);
        } else {
          Alert.alert(action.payload.msg);
        }
      })
      .addCase(handleUpdateBgImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleUpdateBgImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userDetails.bgImage = action.payload.updatedBgImage;
      })
      .addCase(handleUpdateBgImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(handleUpdateIcon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleUpdateIcon.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedIcon = action.payload.updatedIcon;
        state.userDetails.userIcon.customIcon = updatedIcon.customIcon;
        state.userDetails.userIcon.bgColor = updatedIcon.bgColor;
        state.userDetails.userIcon.id = updatedIcon.id;
      })
      .addCase(handleUpdateIcon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(handleUploadPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(handleUploadPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userDetails.postsCount += 1;
      })
      .addCase(handleUploadPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { reduxLogin, reduxLogout } = userSlice.actions;

export default userSlice.reducer;
