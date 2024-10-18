import { Pressable, View, Text, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { navigateToUserProfile } from "../../utils/helper";
import { memo } from "react";

const PostContent = ({ post, navigation, colors }) => {
  return (
    <View style={styles.imageContainer}>
      <View style={styles.uploaderContainer}>
        <Pressable
          onPress={() => navigateToUserProfile(navigation, post.userId)}
        >
          <FastImage
            source={post.userIcon}
            style={[
              styles.uploaderIcon,
              { backgroundColor: post.userIconBgColor },
            ]}
          />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => navigateToUserProfile(navigation, post.userId)}
          >
            <Text style={[styles.uploaderName, { color: colors.text }]}>
              {post.userDisplayName}
            </Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>
            {post.title}
          </Text>
        </View>
        <Text style={styles.timeAgo}>{post.timeAgo}</Text>
      </View>
      <FastImage
        source={{ uri: post.imageUri }}
        resizeMode={FastImage.resizeMode.cover}
        style={[
          styles.image,
          {
            height: post.imageHeight,
          },
        ]}
      />
      {post.description == "" ? (
        <></>
      ) : (
        <View style={styles.descriptionView}>
          <Pressable
            onPress={() => navigateToUserProfile(navigation, post.userId)}
          >
            <Text style={[styles.uploaderName2, { color: colors.text }]}>
              {post.userDisplayName}
            </Text>
          </Pressable>
          <Text style={[styles.description, { color: colors.text }]}>
            {" ‧ " + post.description}
          </Text>
        </View>
      )}
      <Text style={styles.hashtag}>{post.hashtag}</Text>
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
  uploaderContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    width: "95%",
  },
  uploaderIcon: { width: 50, height: 50, borderRadius: 50 },
  uploaderName: { fontSize: 18, paddingLeft: 4, fontWeight: "bold" },
  timeAgo: { color: "grey" },

  title: { fontSize: 16, paddingLeft: 4 },
  image: {
    width: "95%",
    borderRadius: 10,
  },
  description: { fontSize: 16 },
  descriptionView: {
    flexDirection: "row",
    width: "95%",
    marginTop: 4,
  },
  uploaderName2: { fontWeight: "bold", fontSize: 16 },
  hashtag: {
    fontSize: 16,
    width: "95%",
    color: "#6495ED",
  },
});

export default memo(PostContent);
