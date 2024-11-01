import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { selectSongForProfile } from "../../utils/helper";

const PickSongButton = ({ newSong, setNewSong }) => {
  return (
    <TouchableOpacity
      style={styles.configButton}
      activeOpacity={0.7}
      onPress={async () => selectSongForProfile(setNewSong)}
    >
      <Text style={styles.configText}>
        {newSong.name !== null ? newSong.name : "Song"}
      </Text>
    </TouchableOpacity>
  );
};

export default PickSongButton;

const styles = StyleSheet.create({
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
});
