import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import {
  HANDLE_WIDTH,
  PLAYBACK_INDICATOR_TOUCH_WIDTH,
} from "../../../constants/audioConstants";

const TrimHandles = memo(
  ({
    refs,
    panResponders,
    trimPositions,
    currentPosition,
    isPlaying,
    duration,
    zoom,
    containerWidth,
    isDragging,
  }) => {
    const { trimmer, leftHandle, rightHandle } = refs;
    const {
      leftPanResponder,
      rightPanResponder,
      middlePanResponder,
      playbackPanResponder,
    } = panResponders;
    const { left, right } = trimPositions;

    const getPositionStyle = (position) => ({
      left: (position / duration) * containerWidth * zoom,
    });

    return (
      <View style={styles.container}>
        {/* Selected area overlay */}
        <View
          ref={trimmer}
          style={[
            styles.trimmer,
            {
              left: (left / duration) * containerWidth * zoom,
              right:
                containerWidth * zoom -
                (right / duration) * containerWidth * zoom,
            },
          ]}
          {...middlePanResponder.panHandlers}
        />

        {/* Left handle */}
        <View
          ref={leftHandle}
          style={[styles.handle, styles.leftHandle, getPositionStyle(left)]}
          {...leftPanResponder.panHandlers}
        />

        {/* Right handle */}
        <View
          ref={rightHandle}
          style={[styles.handle, styles.rightHandle, getPositionStyle(right)]}
          {...rightPanResponder.panHandlers}
        />

        {/* Playback indicator with touch area */}
        {(isPlaying || isDragging) && (
          <View
            style={[
              styles.playbackIndicatorTouchArea,
              {
                left:
                  (currentPosition / duration) * containerWidth * zoom +
                  HANDLE_WIDTH -
                  PLAYBACK_INDICATOR_TOUCH_WIDTH / 2,
              },
            ]}
            {...playbackPanResponder.panHandlers}
          >
            <View style={styles.playbackIndicator} />
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  trimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  handle: {
    position: "absolute",
    width: 10,
    height: "100%",
    backgroundColor: "black",
    borderRadius: 10,
  },
  leftHandle: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightHandle: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  playbackIndicatorTouchArea: {
    position: "absolute",
    width: 20, // Wider touch area
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  playbackIndicator: {
    width: 2,
    height: "100%",
    backgroundColor: "red",
  },
});

export default TrimHandles;
