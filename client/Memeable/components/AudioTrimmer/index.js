import React, { memo, useCallback } from "react";
import { useTrimControls } from "../../hooks/audioTrimmer/useTrimControls";
import { useAudioState } from "../../hooks/audioTrimmer/useAudioState";
import { useZoom } from "../../hooks/audioTrimmer/useZoom";
import { View, StyleSheet } from "react-native";
import WaveformView from "./WaveformView";
import Controls from "./Controls";

const AudioTrimmer = memo(({ uri, duration, onTrimsChange }) => {
  const { leftTrim, rightTrim, onTrimChange } = useTrimControls(
    duration,
    onTrimsChange
  );

  const { isPlaying, currentPosition, playPreview, stopPreview, setPosition } =
    useAudioState(leftTrim, rightTrim);

  const { zoom, handleZoomIn, handleZoomOut } = useZoom();

  const handlePlaybackStateChange = useCallback(
    (shouldPlay) => {
      if (shouldPlay) {
        playPreview();
      } else {
        stopPreview();
      }
    },
    [playPreview, stopPreview]
  );

  return (
    <View style={styles.container}>
      <WaveformView
        uri={uri}
        duration={duration}
        zoom={zoom}
        leftTrim={leftTrim}
        rightTrim={rightTrim}
        currentPosition={currentPosition}
        isPlaying={isPlaying}
        onTrimChange={onTrimChange}
        onPositionChange={setPosition}
        onPlaybackStateChange={handlePlaybackStateChange}
      />

      <Controls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        isPlaying={isPlaying}
        onPlayPause={isPlaying ? stopPreview : playPreview}
        currentPosition={currentPosition}
        duration={duration}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: "100%",
  },
});

export default AudioTrimmer;
