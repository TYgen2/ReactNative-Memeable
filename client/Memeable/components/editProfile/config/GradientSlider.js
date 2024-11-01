import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const GradientSlider = ({ value, onValueChange }) => {
  return (
    <View style={styles.controls}>
      <Text style={styles.label}>Gradient direction</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#f300ff"
        maximumTrackTintColor="#00f3ff"
      />
    </View>
  );
};

export default GradientSlider;

const styles = StyleSheet.create({
  controls: {
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    width: 280,
  },
  label: {
    color: "white",
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  slider: {
    height: 40,
  },
});
