import { memo } from "react";
import FastImage from "react-native-fast-image";
import { getSongImageSource } from "../../utils/helper";
import { StyleSheet } from "react-native";

export default UserSongCover = memo(({ songImg, width, height, opacity }) => {
  return (
    <FastImage
      source={getSongImageSource(songImg)}
      style={[styles.image, { width, height, opacity }]}
      resizeMode="contain"
    />
  );
});

const styles = StyleSheet.create({
  image: {
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "black",
  },
});
