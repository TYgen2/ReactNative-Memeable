import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { getIconSource } from "../../utils/helper";
import { memo, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

export default CommentItem = memo(({ item, navigation, colors, onReply }) => {
  const iconBgColor = item.user?.icon.bgColor || "transparent";
  const iconSource = getIconSource(item.user?.icon);

  const [isSubCommentsExpanded, setIsSubCommentsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {/* icon */}
      <Pressable style={styles.icon} onPress={() => navigation(item?.userId)}>
        <Image
          source={iconSource}
          style={[styles.icon, { backgroundColor: iconBgColor }]}
        />
      </Pressable>

      {/* text info */}
      <View style={styles.textInfo}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* display name */}
          <Pressable onPress={() => navigation(item?.userId)}>
            <Text style={[styles.displayName, { color: colors.text }]}>
              {item.user?.displayName}
            </Text>
          </Pressable>

          {/* comment time ago */}
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </View>

        {/* comment content */}
        <Text style={[styles.content, { color: colors.text }]}>
          {item.content}
        </Text>

        {/* reply button */}
        <Pressable onPress={() => onReply(item.user.displayName, item._id)}>
          <Text style={styles.replyText}>Reply</Text>
        </Pressable>

        {/* see sub comments */}
        {item.hasSubComment && (
          <Pressable
            onPress={() => {
              setIsSubCommentsExpanded(!isSubCommentsExpanded);
              if (!isSubCommentsExpanded) {
                onFetchSubComments(item._id);
              }
            }}
          >
            <Text style={styles.otherReplyText}>
              {isSubCommentsExpanded ? "Hide replies" : "See other replies"}
            </Text>
          </Pressable>
        )}
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
  replyText: { fontSize: 12, color: "grey" },
  otherReplyText: { marginLeft: 20, marginTop: 10, color: "grey" },
});
