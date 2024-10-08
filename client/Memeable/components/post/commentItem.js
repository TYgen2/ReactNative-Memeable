import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { getIconSource, navigateToUserProfile } from "../../utils/helper";
import { memo } from "react";
import Icon from "react-native-vector-icons/Ionicons";

export default CommentItem = memo(({ item, navigation, colors }) => {
  const iconBgColor = item.user?.icon.bgColor || "transparent";
  const iconSource = getIconSource(item.user?.icon);

  return (
    <View style={styles.container}>
      {/* icon */}
      <Pressable style={styles.icon}>
        <Image
          source={iconSource}
          style={[styles.icon, { backgroundColor: iconBgColor }]}
        />
      </Pressable>

      {/* text info */}
      <View style={styles.textInfo}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[styles.displayName, { color: colors.text }]}>
            {item.user?.displayName}
          </Text>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>
        <Text style={[styles.content, { color: colors.text }]}>
          {item.content}
        </Text>
      </View>

      {/* like count */}
      <View style={styles.likeInfo}>
        <Text style={styles.likes}>{item.likes}</Text>
        <TouchableOpacity>
          <Icon name={"heart-outline"} size={14} color={"grey"} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textInfo: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  displayName: { fontWeight: "bold", fontSize: 16 },
  timeAgo: { color: "grey", fontSize: 14, paddingLeft: 10 },
  content: { fontSize: 16 },
  followStatus: { color: "grey" },
  likeInfo: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  likes: { fontSize: 14, color: "grey" },
});
