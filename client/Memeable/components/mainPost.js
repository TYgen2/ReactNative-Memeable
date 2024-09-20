import { memo, useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  displayLikes,
  getIconSource,
  getSquareImageHeight,
  navigateToUserProfile,
} from "../utils/helper";
import FastImage from "react-native-fast-image";
import { handleLike } from "../handleAPIs/userActions";

const squareHeight = getSquareImageHeight();

export default MainPost = memo(({ item, navigation }) => {
  const iconBgColor = item.userId?.icon.bgColor || "transparent";
  const userIcon = getIconSource(item.userId?.icon);

  const [postState, setPostState] = useState({
    likes: item.likes,
    liked: item.hasLiked,
    saved: false,
  });

  // update local like status and like count
  const toggleLike = useCallback(async () => {
    setPostState((prevState) => ({
      ...prevState,
      liked: !prevState.liked,
      likes: prevState.liked ? prevState.likes - 1 : prevState.likes + 1,
    }));

    await handleLike(item._id);
  }, [item._id]);

  const toggleSave = useCallback(() => {
    setPostState((prevState) => ({
      ...prevState,
      saved: !prevState.saved,
    }));
  }, []);

  return (
    <View style={styles.postContainer}>
      <View style={styles.imageContainer}>
        <View style={styles.uploaderContainer}>
          <Pressable
            onPress={() => navigateToUserProfile(navigation, item.userId._id)}
          >
            <FastImage
              source={userIcon}
              style={[styles.uploaderIcon, { backgroundColor: iconBgColor }]}
            />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => navigateToUserProfile(navigation, item.userId._id)}
            >
              <Text style={styles.uploaderName}>{item.userId.displayName}</Text>
            </Pressable>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
        <FastImage
          source={{ uri: item.imageUri }}
          resizeMode={FastImage.resizeMode.cover}
          style={[
            styles.image,
            {
              height:
                item.height > item.width
                  ? 500
                  : item.height < item.width
                  ? 200
                  : squareHeight,
            },
          ]}
        />
        {item.description == "" ? (
          <></>
        ) : (
          <View style={styles.descriptionView}>
            <Pressable
              onPress={() => navigateToUserProfile(navigation, item.userId._id)}
            >
              <Text style={styles.uploaderName2}>
                {item.userId.displayName}
              </Text>
            </Pressable>
            <Text style={styles.description}>{" ‧ " + item.description}</Text>
          </View>
        )}
        <Text style={styles.hashtag}>{item.hashtag}</Text>
      </View>
      <View style={styles.rightsideBar}>
        {/* save icon */}
        <TouchableOpacity onPress={toggleSave}>
          <Icon
            name={postState.saved ? "bookmark" : "bookmark-outline"}
            size={32}
          />
        </TouchableOpacity>
        {/* like, comment */}
        <View style={styles.actionsContainer}>
          {/* like button */}
          <View style={styles.center}>
            <Text>{displayLikes(postState.likes)}</Text>
            <TouchableOpacity onPress={toggleLike}>
              <Icon
                name={postState.liked ? "heart" : "heart-outline"}
                size={32}
                color={postState.liked ? "#FF4433" : "grey"}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate("CommentModal");
            }}
          >
            <Icon name="chatbox-ellipses-outline" size={32} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.3)",
  },
  imageContainer: {
    flex: 10,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingVertical: 20,
  },
  image: {
    width: "95%",
    borderRadius: 10,
  },
  uploaderContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    width: "95%",
  },
  timeAgo: { color: "grey" },
  uploaderIcon: { width: 50, height: 50, borderRadius: 50 },
  uploaderName: { fontSize: 18, paddingLeft: 4, fontWeight: "bold" },
  title: { fontSize: 16, paddingLeft: 4 },
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
  rightsideBar: {
    flex: 2,
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
  },
  actionsContainer: {
    gap: 10,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
