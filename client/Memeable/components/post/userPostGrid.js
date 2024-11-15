import { StyleSheet, TouchableOpacity } from "react-native";
import { screenWidth } from "../../utils/constants";
import FastImage from "react-native-fast-image";
import { memo } from "react";
import { useSelector } from "react-redux";

const UserPostGrid = memo(({ item, navigation }) => {
  const post = useSelector(
    (state) => state.post.allPosts.find((p) => p._id === item._id) || item
  );

  return (
    <TouchableOpacity
      style={styles.imageContainer}
      activeOpacity={0.8}
      onPress={() => {
        navigation.push("DetailedPost", { item: post, fromProfile: true });
      }}
    >
      <FastImage source={{ uri: item.imageUri }} style={styles.image} />
    </TouchableOpacity>
  );
});

export default UserPostGrid;

const styles = StyleSheet.create({
  imageContainer: { margin: 1 },
  image: { width: screenWidth / 3, height: screenWidth / 3 },
});
