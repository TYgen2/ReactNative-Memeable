import { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { DEFAULT_ICONS } from "../utils/constants";
import { getTokens } from "../utils/tokenActions";
import { handleLike } from "../handleAPIs/userActions";
import { displayLikes } from "../utils/helper";

export default MainPosts = ({ item, userId, navigation }) => {
  const iconBgColor = item.userId.icon.bgColor || "transparent";
  const userIcon = item.userId.icon.customIcon
    ? { uri: item.userId.icon.customIcon }
    : DEFAULT_ICONS.find((icon) => icon.id === item.userId.icon.id).source;

  const [likes, setLikes] = useState(item.likes);

  // like icon
  const [liked, setLiked] = useState(item.hasLiked);
  const toggleLike = () => {
    setLiked(!liked);
  };
  // save icon
  const [saved, setSaved] = useState(false);
  const toggleSave = () => {
    setSaved(!saved);
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.imageContainer}>
        <View style={styles.uploaderContainer}>
          <Pressable
            onPress={() =>
              navigation.navigate("UserProfile", {
                isStack: true,
                targetId: item.userId,
              })
            }
          >
            <Image
              source={userIcon}
              style={[styles.uploaderIcon, { backgroundColor: iconBgColor }]}
            />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() =>
                navigation.navigate("UserProfile", {
                  isStack: true,
                  targetId: item.userId,
                })
              }
            >
              <Text style={styles.uploaderName}>{item.userId.displayName}</Text>
            </Pressable>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
        <Image
          source={{ uri: item.imageUri }}
          style={[
            styles.image,
            { height: item.height > item.width ? 500 : 200 },
          ]}
        />
        {item.description == "" ? (
          <></>
        ) : (
          <View style={{ flexDirection: "row", width: "95%", marginTop: 4 }}>
            <Pressable
              onPress={() =>
                navigation.navigate("UserProfile", {
                  isStack: true,
                  targetId: item.userId,
                })
              }
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
          <Icon name={saved ? "bookmark" : "bookmark-outline"} size={36} />
        </TouchableOpacity>
        {/* like, comment */}
        <View style={styles.actionsContainer}>
          {/* like button */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{displayLikes(likes)}</Text>
            <TouchableOpacity
              onPress={async () => {
                toggleLike();
                const tokens = await getTokens();
                await handleLike(
                  userId,
                  item._id,
                  tokens.jwtToken,
                  tokens.refreshToken
                ).then(() => {
                  if (liked) {
                    setLikes((prev) => prev - 1);
                    console.log("Successfully unliked!");
                  } else {
                    setLikes((prev) => prev + 1);
                    console.log("Successfully liked!");
                  }
                });
              }}
            >
              <Icon
                name={liked ? "heart" : "heart-outline"}
                size={36}
                color={liked ? "#FF4433" : "grey"}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Icon name="chatbox-ellipses-outline" size={36} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    resizeMode: "cover",
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
});
