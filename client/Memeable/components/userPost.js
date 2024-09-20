import { StyleSheet, TouchableOpacity } from "react-native";
import { screenWidth } from "../utils/constants";
import FastImage from "react-native-fast-image";
import { memo } from "react";

export default UserPost = memo(({ item }) => {
  return (
    <TouchableOpacity
      style={styles.imageContainer}
      activeOpacity={0.8}
      onPress={() => console.log(item)}
    >
      <FastImage source={{ uri: item.imageUri }} style={styles.image} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  imageContainer: { margin: 1 },
  image: { width: screenWidth / 3, height: screenWidth / 3 },
});
