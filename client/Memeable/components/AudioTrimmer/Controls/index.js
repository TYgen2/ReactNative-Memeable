import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import ZoomControls from "./ZoomControls";
import PlaybackControls from "./PlaybackControls";
import TimeDisplay from "./TimeDisplay";

const Controls = memo(
  ({
    zoom,
    onZoomIn,
    onZoomOut,
    isPlaying,
    onPlayPause,
    currentPosition,
    duration,
  }) => {
    return (
      <View style={styles.container}>
        <View style={styles.leftControls}>
          <ZoomControls zoom={zoom} onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
          <PlaybackControls isPlaying={isPlaying} onPlayPause={onPlayPause} />
        </View>
        <TimeDisplay currentPosition={currentPosition} duration={duration} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  leftControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default Controls;
