import { Pressable, StyleSheet } from "react-native";
import React, { memo, useCallback } from "react";
import FastImage from "react-native-fast-image";

const PostMedia = ({ post, navigation }) => {
  const handleImagePressed = useCallback(() => {
    navigation.navigate("FunctionStack", {
      screen: "FullscreenImage",
      params: { imageUri: post.imageUri },
    });
  }, [navigation, post.imageUri]);

  return (
    <Pressable
      onPress={handleImagePressed}
      style={[styles.image, { height: post.imageHeight }]}
    >
      <FastImage
        source={{ uri: post.imageUri }}
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.image, { height: post.imageHeight }]}
      />
    </Pressable>
  );
};

export default memo(PostMedia);

const styles = StyleSheet.create({
  image: {
    width: "95%",
    borderRadius: 10,
  },
});
