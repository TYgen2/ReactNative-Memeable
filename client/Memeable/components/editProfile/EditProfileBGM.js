import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import useColorTheme from "../../hooks/useColorTheme";
import useUpdateSong from "../../hooks/updateUserProfile/useUpdateSong";
import { selectSongForProfile } from "../../utils/helper";
import UserSongCover from "../userProfile/UserSongCover";
import GlowingBorder from "../../components/GlowingBorder";
import PickSongButton from "./PickSongButton";
import PlaybackButton from "./PlaybackButton";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const EditProfileBGM = ({ gradientData, imageUri, songData }) => {
  const { colors } = useColorTheme();
  const navigation = useNavigation();

  const goToEditCoverPage = () => {
    navigation.navigate("EditSongCover", {
      gradient: gradientData,
      image: imageUri,
    });
  };

  return (
    <View style={styles.songContainer}>
      <Text style={[styles.profileBGM, { color: colors.text }]}>
        🎵Profile BGM🎵
      </Text>

      <View style={styles.configContainer}>
        <PickSongButton songData={songData} />

        <TouchableOpacity
          style={styles.imageContainer}
          activeOpacity={0.8}
          onPress={goToEditCoverPage}
        >
          <Icon
            name="create-outline"
            size={30}
            color="white"
            style={styles.editIcon}
          />
          <GlowingBorder
            gradientConfig={gradientData}
            width={125}
            height={125}
          />
          <UserSongCover
            songImg={imageUri}
            width={120}
            height={120}
            opacity={0.7}
          />
        </TouchableOpacity>

        <PlaybackButton />
      </View>
    </View>
  );
};

export default EditProfileBGM;

const styles = StyleSheet.create({
  profileBGM: {
    paddingTop: 4,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  songContainer: {
    height: 200,
  },
  configContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: { position: "absolute", zIndex: 1 },
});
