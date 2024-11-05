import React from "react";
import { Text, StyleSheet } from "react-native";
import { formatTime } from "../../../utils/audioTrimmer/timeHelpers";

const TimeDisplay = ({ currentPosition, duration }) => {
  return (
    <Text style={styles.text}>
      {formatTime(currentPosition)} / {formatTime(duration)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: "#333",
    fontVariant: ["tabular-nums"],
  },
});

export default TimeDisplay;
