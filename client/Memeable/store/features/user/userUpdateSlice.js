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
    .addCase(handleUpdateBgImage.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails.bgImage = action.payload.updatedBgImage;
    })
    .addCase(handleUpdateIcon.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails.userIcon = action.payload.updatedIcon;
    })
    .addCase(handleUploadPost.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails.postsCount += 1;
    })
    .addCase(handleUpdateSong.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails.song.songUri = action.payload.updatedSongUri;
      state.userDetails.song.songName = action.payload.updatedSongName;
    })
    .addCase(handleUpdateGradient.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails.gradientConfig = action.payload.updatedGradient;
    })
    .addCase(handleUpdateCover.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userDetails.song.imageUri = action.payload.updatedCover;
    });
};
