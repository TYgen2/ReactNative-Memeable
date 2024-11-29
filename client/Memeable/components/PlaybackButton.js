import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

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
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 35,
          width,
          height,
          backgroundColor: colors.secondary,
          opacity: !hasSong ? 0.5 : 1,
        }}
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
    </View>
  );
};

export default PlaybackButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
