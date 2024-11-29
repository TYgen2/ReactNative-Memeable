import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { pickAudio } from "../../utils/audioTrimmer/audioHelpers";
import { useNavigation } from "@react-navigation/native";
import useColorTheme from "../../hooks/useColorTheme";
import { formatSongName } from "../../utils/helper";

const PickSongButton = ({ songData }) => {
  const { colors } = useColorTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.configButton, { backgroundColor: colors.secondary }]}
        activeOpacity={0.7}
        onPress={() => pickAudio(navigation, songData)}
      >
        <Text style={[styles.configText, { color: colors.primary }]}>
          {songData.songName ? "Edit" : "Select"}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.songName, { color: colors.text }]}>
        {songData.songName ? formatSongName(songData.songName) : "no song yet"}
      </Text>
    </View>
  );
};

export default PickSongButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  configButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  configText: {
    fontWeight: "bold",
  },
  songName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginHorizontal: 10,
  },
});
