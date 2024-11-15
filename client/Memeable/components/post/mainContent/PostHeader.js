import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo, useCallback } from "react";
import FastImage from "react-native-fast-image";
import { navigateToUserProfile } from "../../../utils/helper";

const PostHeader = ({ post, navigation, colors }) => {
  const handleIconPressed = useCallback(() => {
    navigateToUserProfile(navigation, post.userId);
  }, [navigation, post.userId]);

  return (
    <View style={styles.uploaderContainer}>
      {/* uploader icon */}
      <Pressable onPress={handleIconPressed}>
        <FastImage
          source={post.userIcon}
          style={[
            styles.uploaderIcon,
            { backgroundColor: post.userIconBgColor },
          ]}
        />
      </Pressable>

      <View style={styles.uploaderInfoContainer}>
        {/* uploader name */}
        <Text style={[styles.uploaderName, { color: colors.text }]}>
          {post.userDisplayName}
        </Text>
        {/* title */}
        <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
      </View>

      {/* time ago */}
      <Text style={styles.timeAgo}>{post.timeAgo}</Text>
    </View>
  );
};

export default memo(PostHeader);

const styles = StyleSheet.create({
  uploaderContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    width: "95%",
  },
  uploaderInfoContainer: { flex: 1, paddingLeft: 8 },
  uploaderIcon: { width: 50, height: 50, borderRadius: 50 },
  uploaderName: { fontSize: 18, fontWeight: "bold" },
  title: { fontSize: 16 },
  timeAgo: { color: "grey" },
});
