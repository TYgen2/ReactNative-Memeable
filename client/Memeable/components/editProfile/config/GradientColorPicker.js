import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { debounce } from "lodash";

const GradientColorPicker = ({ color, onColorChange, label }) => {
  // Debounce color changes
  const debouncedOnChange = useMemo(
    () => debounce(onColorChange, 16), // 60fps threshold
    [onColorChange]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ColorPicker
        color={color}
        onColorChange={debouncedOnChange}
        thumbSize={20}
        noSnap={false}
        row={false}
        swatches={false}
        sliderHidden={true}
        discrete={true}
      />
    </View>
  );
};

export default GradientColorPicker;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingBottom: 100,
  },
  label: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
