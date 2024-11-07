import TrackPlayer, { RepeatMode } from "react-native-track-player";
import DocumentPicker from "react-native-document-picker";

export const setupPlayer = async () => {
  try {
    // Check if the player is already initialized
    try {
      const playbackState = await TrackPlayer.getPlaybackState();
      if (playbackState.state !== null) {
        return true;
      }
    } catch {
      // Player is not initialized
    }

    await TrackPlayer.setupPlayer();
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
    console.log("Player setup successfully!!");
    return true;
  } catch (error) {
    console.log("Error setting up player:", error);
    return false;
  }
};

// Function to get duration with retry
const getDurationWithRetry = async (maxRetries = 5, delay = 300) => {
  for (let i = 0; i < maxRetries; i++) {
    const progress = await TrackPlayer.getProgress();
    if (progress.duration > 0) {
      return progress.duration;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Failed to get audio duration");
};

export const pickAudio = async (navigation, songData) => {
  try {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.audio],
      copyTo: "cachesDirectory",
    });

    if (result.length > 0) {
      const { fileCopyUri, name } = result[0];

      try {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          url: fileCopyUri,
          title: name,
        });

        // Get the duration using the retry mechanism
        const durationInSeconds = await getDurationWithRetry();

        navigation.navigate("EditSongAudio", {
          songData: songData,
          audioPath: fileCopyUri,
          duration: durationInSeconds * 1000,
          audioName: name,
        });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      console.log("User cancelled the picker");
    } else {
      console.log(error);
      Alert.alert("Error", "An error occurred while picking the audio file.");
    }
  }
};
