import React, { forwardRef } from "react";
import { requireNativeComponent, StyleSheet } from "react-native";

const NativeAudioWaveform = requireNativeComponent("AudioWaveform");

const Waveform = forwardRef(({ uri, zoom, width }, ref) => {
  return (
    <NativeAudioWaveform
      ref={ref}
      style={[styles.container, { width: width * zoom }]}
      audioPath={uri}
      waveformColor="#666666"
      progressColor="#007AFF"
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Waveform;
