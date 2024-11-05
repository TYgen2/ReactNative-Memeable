import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import RNFS from "react-native-fs";
import { useTrimControls } from "../../hooks/audioTrimmer/useTrimControls";
import { trimAudio } from "../../utils/audioTrimmer/ffmpegAudioTrimmer";
import AudioTrimmer from "../../components/AudioTrimmer";
import useUpdateSong from "../../hooks/updateUserProfile/useUpdateSong";
import { useProfileUpdates } from "../../context/ProfileUpdateContext";

const EditSongAudio = ({ route, navigation }) => {
  const { songData, audioPath, duration, audioName } = route.params;
  const trimmedAudioPath = audioPath.replace("file://", "");
  const [isLoading, setIsLoading] = useState(false);
  const [isTrimmed, setIsTrimmed] = useState(false);

  const { newSong, setNewSong, updateSongInfo } = useUpdateSong(songData);

  const { registerUpdate } = useProfileUpdates();

  useEffect(() => {
    registerUpdate("song", updateSongInfo);
  }, [updateSongInfo]);

  // Use the trimControls hook instead of separate states
  const { leftTrim, rightTrim, onTrimChange } = useTrimControls(
    duration,
    () => {}
  );

  const handleTrim = useCallback(async () => {
    setIsLoading(true);
    const outputPath = `${
      RNFS.CachesDirectoryPath
    }/trimmed_audio_${Date.now()}.mp3`;

    try {
      const trimmedPath = await trimAudio(
        trimmedAudioPath,
        outputPath,
        Math.floor(leftTrim),
        Math.floor(rightTrim - leftTrim)
      );

      setNewSong({
        songUri: trimmedPath,
        songName: audioName,
      });
      setIsTrimmed(true);
    } catch (error) {
      console.error("Error trimming audio:", error);
      // Handle error (e.g., show an alert to the user)
    } finally {
      setIsLoading(false);
    }
  }, [leftTrim, rightTrim, trimmedAudioPath, navigation]);

  const handleApplyChanges = () => {
    const updatedPreview = {
      song: newSong,
    };

    navigation.navigate("EditUserProfile", {
      updatedPreview,
    });
  };

  if (!duration) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.trimTitleContainer}>
        <Text style={styles.trimInfoText}>
          Trim the audio with a duration between 10 - 30s
        </Text>
      </View>
      <Text style={styles.title}>{audioName}</Text>
      <AudioTrimmer
        uri={trimmedAudioPath}
        duration={duration}
        onTrimsChange={onTrimChange}
      />
      <TouchableOpacity
        onPress={handleTrim}
        style={[styles.trimButton, isLoading && styles.trimButtonDisabled]}
        disabled={isLoading}
      >
        <Text style={styles.trimButtonText}>
          {isLoading ? "Trimming..." : "Trim"}
        </Text>
      </TouchableOpacity>
      {isTrimmed && (
        <TouchableOpacity
          onPress={handleApplyChanges}
          style={styles.applyButton}
        >
          <Text style={styles.applyButtonText}>Apply Changes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  trimTitleContainer: {
    position: "absolute",
    height: 200,
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  trimInfoText: {
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  trimButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 120,
    alignItems: "center",
  },
  trimButtonDisabled: {
    backgroundColor: "#99CCFF",
  },
  trimButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 120,
    alignItems: "center",
  },
  applyButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(EditSongAudio);
