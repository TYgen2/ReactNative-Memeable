import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { pickAudio } from "../../utils/audioTrimmer/audioHelpers";
import { useNavigation } from "@react-navigation/native";

const PickSongButton = ({ songData }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.configButton}
        activeOpacity={0.7}
        onPress={() => pickAudio(navigation, songData)}
      >
        <Text style={styles.configText}>Select</Text>
      </TouchableOpacity>
      <Text style={styles.songName}>
        {songData.songName ? songData.songName : "no song yet"}
      </Text>
    </View>
  );
};

export default PickSongButton;

const styles = StyleSheet.create({
  container: {
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
  },
});
