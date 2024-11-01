import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const PlaybackButton = () => {
  return (
    <TouchableOpacity style={styles.configButton} activeOpacity={0.7}>
      <Text style={styles.configText}>Temp</Text>
    </TouchableOpacity>
  );
};

export default PlaybackButton;

const styles = StyleSheet.create({
  configButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  configText: {
    fontWeight: "bold",
  },
});
