import { StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";

const PostDescription = ({ post, colors }) => {
  if (post.description === "") return null;

  return (
    <View style={styles.descriptionView}>
      {/* uploader name */}
      <Text style={[styles.uploaderName, { color: colors.text }]}>
        {post.userDisplayName}
      </Text>
      {/* description */}
      <Text style={[styles.description, { color: colors.text }]}>
        {" ‧ " + post.description}
      </Text>
    </View>
  );
};

export default memo(PostDescription);

const styles = StyleSheet.create({
  descriptionView: {
    flexDirection: "row",
    width: "95%",
    marginTop: 4,
  },
  uploaderName: { fontWeight: "bold", fontSize: 16 },
  description: { fontSize: 16 },
});
