import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { getIconSource, navigateToUserProfile } from "../../utils/helper";
import FastImage from "react-native-fast-image";

const NotificationItem = ({ item, colors, navigation }) => {
  const { icon } = item.sender;

  const senderId = item.sender._id;
  const senderIcon = getIconSource(icon);
  const senderIconBgColor = item?.sender?.icon?.bgColor || "transparent";
  const relatedPostIcon = item?.post?.imageUri;

  const notificationContent = (notificationType) => {
    switch (notificationType) {
      case "follow":
        return `has followed you.`;
      case "like_post":
        return `liked your post.`;
      case "comment":
        return `commented on your post.`;
      case "like_comment":
        return `liked your comment.`;

      default:
        return "";
    }
  };

  return (
    <Pressable
      disabled={item.type === "follow" ? true : false}
      style={[styles.container, { backgroundColor: colors.primary }]}
      onPress={() => {
        navigation.push("DetailedPost", { item: item.post });
      }}
    >
      {/* Sender Icon */}
      <Pressable
        onPress={() => navigateToUserProfile(navigation, senderId)}
        style={styles.imageContainer}
      >
        <FastImage
          source={senderIcon}
          style={[styles.image, { backgroundColor: senderIconBgColor }]}
        />
      </Pressable>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text
          style={[styles.content, { color: colors.text }]}
          numberOfLines={2}
        >
          <Text style={styles.contentSender}>
            {item.sender.displayName + ` `}
          </Text>
          {notificationContent(item.type)}
          <Text style={styles.timeAgo}>{` ` + item.timeAgo}</Text>
        </Text>
      </View>

      {/* Related Post's icon */}
      <View style={styles.relatedPostContainer}>
        <FastImage
          source={{ uri: relatedPostIcon }}
          style={styles.relatedPostIcon}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
};

export default memo(NotificationItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 80,
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  content: {
    fontSize: 16,
  },
  contentSender: {
    fontWeight: "bold",
  },
  relatedPostContainer: {
    width: 50,
    height: 50,
    marginLeft: "auto",
  },
  relatedPostIcon: {
    width: 50,
    height: 50,
  },
  timeAgo: {
    fontSize: 16,
    color: "grey",
  },
});
