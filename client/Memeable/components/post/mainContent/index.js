import { View, StyleSheet } from "react-native";
import { memo } from "react";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostDescription from "./PostDescription";
import PostHashTag from "./PostHashTag";

const PostContent = ({ post, navigation, colors }) => {
  return (
    <View style={styles.imageContainer}>
      <PostHeader post={post} navigation={navigation} colors={colors} />
      <PostMedia post={post} navigation={navigation} />
      <PostDescription post={post} colors={colors} />
      <PostHashTag post={post} colors={colors} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 10,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingVertical: 20,
  },
});

export default memo(PostContent);
