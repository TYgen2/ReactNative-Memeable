import { memo } from "react";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";

export default UserSongCover = memo(({ imageUri }) => {
  return (
    <FastImage
      source={require("../../assets/alya.jpg")}
      style={styles.image}
      resizeMode="cover"
    />
  );
});

const styles = StyleSheet.create({
  image: {
    width: 90,
    height: 90,
    borderRadius: 5,
    position: "absolute",
    right: 0,
    top: 0,
    marginRight: 25,
    marginTop: 25,
  },
});
