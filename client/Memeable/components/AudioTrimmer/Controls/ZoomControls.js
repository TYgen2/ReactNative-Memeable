import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const ZoomControls = ({ zoom, onZoomIn, onZoomOut }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onZoomOut}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      <Text style={styles.zoomText}>Zoom: {zoom}x</Text>

      <TouchableOpacity style={styles.button} onPress={onZoomIn}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#333",
  },
  zoomText: {
    fontSize: 14,
    color: "#666",
    minWidth: 60,
    textAlign: "center",
  },
});

export default ZoomControls;
