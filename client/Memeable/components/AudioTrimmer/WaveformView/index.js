import React, { memo, useCallback } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Waveform from "./Waveform";
import TrimHandles from "./TrimHandles";
import { useScrolling } from "../../../hooks/audioTrimmer/useScrolling";
import { useWaveformGestures } from "../../../hooks/audioTrimmer/useWaveformGestures";

const WaveformView = memo(
  ({
    uri,
    duration,
    zoom,
    leftTrim,
    rightTrim,
    currentPosition,
    isPlaying,
    onTrimChange,
    onPositionChange,
    onPlaybackStateChange,
  }) => {
    const {
      scrollViewRef,
      containerWidth,
      contentWidth,
      handleScroll,
      handleLayout,
    } = useScrolling(zoom);

    const { trimmerRef, handleRefs, panResponders, isDragging } =
      useWaveformGestures({
        zoom,
        duration,
        leftTrim,
        rightTrim,
        containerWidth,
        onTrimChange,
        onPositionChange,
        onPlaybackStateChange,
        currentPosition,
      });

    const handleLayoutCallback = useCallback(
      (event) => {
        handleLayout(event);
      },
      [handleLayout]
    );

    const handleScrollCallback = useCallback(
      (event) => {
        handleScroll(event);
      },
      [handleScroll]
    );

    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScrollCallback}
        scrollEventThrottle={16}
        onLayout={handleLayoutCallback}
        contentContainerStyle={{ width: contentWidth }}
      >
        <View style={[styles.container, { width: contentWidth }]}>
          <Waveform uri={uri} zoom={zoom} width={containerWidth} />
          <TrimHandles
            refs={{ trimmer: trimmerRef, ...handleRefs }}
            panResponders={panResponders}
            trimPositions={{ left: leftTrim, right: rightTrim }}
            currentPosition={currentPosition}
            isPlaying={isPlaying}
            duration={duration}
            zoom={zoom}
            containerWidth={containerWidth}
            isDragging={isDragging}
          />
        </View>
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 100,
    position: "relative",
  },
});

export default WaveformView;
