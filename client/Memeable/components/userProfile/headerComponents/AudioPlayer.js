import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import GlowingBorder from "../../GlowingBorder";
import UserSongCover from "../UserSongCover";
import { formatSongName } from "../../../utils/helper";
import PlaybackButton from "../../PlaybackButton";
import { useAutoplayBGM } from "../../../hooks/useAutoPlayBGM";
import usePlaybackPreview from "../../../hooks/usePlaybackPreview";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useColorTheme from "../../../hooks/useColorTheme";
import TextTicker from "react-native-text-ticker";

const AudioPlayer = ({ userData }) => {
  const { colors } = useColorTheme();
  const navigation = useNavigation();

  const { isPlaying, togglePlayback, resetPlayer, cleanup } =
    usePlaybackPreview(userData.song.songUri);
  const { isLoaded, shouldAutoplay } = useAutoplayBGM();

  // Clean up player when navigating from UserProfile to other EditUserProfile
  // i.e. when the audio is playing and the user navigates to the edit profile page
  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", cleanup);
    return () => unsubscribeBlur();
  }, [navigation, cleanup]);

  useFocusEffect(
    useCallback(() => {
      // If user modified the audio but didn't save, reset the player with the original song
      resetPlayer().then(() => {
        // Autoplay behavior as user's preference
        if (isLoaded && shouldAutoplay && !isPlaying) {
          togglePlayback();
        }
      });
    }, [isLoaded, shouldAutoplay])
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TextTicker style={[styles.songName, { color: colors.text }]} loop>
          {formatSongName(userData.song.songName)}
        </TextTicker>

        <View style={styles.songCoverContainer}>
          <GlowingBorder
            gradientConfig={userData.gradientConfig}
            width={100}
            height={100}
          />
          <UserSongCover
            songImg={userData.song.imageUri}
            width={95}
            height={95}
          />
        </View>
      </View>

      <View style={styles.playbackButtonContainer}>
        <PlaybackButton
          width={30}
          height={30}
          iconSize={16}
          isPlaying={isPlaying}
          togglePlayback={togglePlayback}
          hasSong={!!userData.song.songUri}
        />
      </View>
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 150,
    height: 150,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  songName: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
    textAlign: "center",
  },
  songCoverContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  playbackButtonContainer: {
    marginTop: 30,
  },
});
