import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const PlaybackControls = ({ isPlaying, onPlayPause }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPlayPause}>
      <Text style={styles.buttonText}>{isPlaying ? "⏸️" : "▶️"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default PlaybackControls;
