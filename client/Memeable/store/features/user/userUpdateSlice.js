import { Alert } from "react-native";
import {
  handleUpdateStrings,
  handleUpdateBgImage,
  handleUpdateIcon,
  handleUploadPost,
  handleUpdateSong,
  handleUpdateGradient,
  handleUpdateCover,
} from "../../actions/userActions";

export const userUpdateReducer = (builder) => {
  builder
    .addCase(handleUpdateStrings.pending, (state) => {
      state.status = "loading";
    })
    .addCase(handleUpdateStrings.fulfilled, (state, action) => {
      state.status = "succeeded";
      const updatedInfo = action.payload.updatedStrings;
      state.userDetails.username = updatedInfo.username;
      state.userDetails.displayName = updatedInfo.displayName;
      state.userDetails.userBio = updatedInfo.userBio;
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
      state.userDetails.userIcon = action.payload.updatedIcon;
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
    })
    .addCase(handleUpdateSong.pending, (state) => {
      state.status = "loading";
    })
    .addCase(handleUpdateSong.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails.song.songUri = action.payload.updatedSongUri;
      state.userDetails.song.songName = action.payload.updatedSongName;
    })
    .addCase(handleUpdateSong.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(handleUpdateGradient.pending, (state) => {
      state.status = "loading";
    })
    .addCase(handleUpdateGradient.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails.gradientConfig = action.payload.updatedGradient;
    })
    .addCase(handleUpdateGradient.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(handleUpdateCover.pending, (state) => {
      state.status = "loading";
    })
    .addCase(handleUpdateCover.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails.song.imageUri = action.payload.updatedCover;
    })
    .addCase(handleUpdateCover.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
};
