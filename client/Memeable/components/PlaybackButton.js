import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import usePlaybackPreview from "../hooks/usePlaybackPreview";

const PlaybackButton = ({
  width,
  height,
  iconSize,
  togglePlayback,
  isPlaying,
  hasSong,
}) => {
  const { colors } = useColorTheme();

  return (
    <TouchableOpacity
      style={[
        styles.configButton,
        {
          width,
          height,
          backgroundColor: colors.secondary,
          opacity: !hasSong ? 0.5 : 1,
        },
      ]}
      activeOpacity={0.7}
      onPress={togglePlayback}
      disabled={!hasSong}
    >
      <Icon
        name={isPlaying ? "pause-outline" : "play-outline"}
        size={iconSize}
        color={colors.primary}
        style={!isPlaying && { paddingLeft: 2 }}
      />
    </TouchableOpacity>
  );
};

export default PlaybackButton;

const styles = StyleSheet.create({
  configButton: {
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
