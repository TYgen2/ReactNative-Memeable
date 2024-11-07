import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const PlaybackControls = ({ isPlaying, onPlayPause }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPlayPause}
      activeOpacity={0.8}
    >
      <Icon
        name={isPlaying ? "pause" : "play"}
        size={24}
        color="white"
        style={!isPlaying && { paddingLeft: 2 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    backgroundColor: "#000000",
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
