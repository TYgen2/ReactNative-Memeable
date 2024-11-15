import { StyleSheet, Text } from "react-native";
import React, { memo } from "react";

const PostHashTag = ({ post, colors }) => {
  return <Text style={styles.hashtag}>{post.hashtag}</Text>;
};

export default memo(PostHashTag);

const styles = StyleSheet.create({
  hashtag: {
    fontSize: 16,
    width: "95%",
    color: "#6495ED",
  },
});
