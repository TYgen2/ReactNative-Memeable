import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { getIconSource } from "../../utils/helper";
import { memo, useCallback, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { handleCommentLike } from "../../handleAPIs/userActions";

const CommentItem = ({
  item,
  navigation,
  colors,
  onReply,
  onFetchSubComments,
  isSubComment,
  onCommentLikeUpdate,
}) => {
  const iconBgColor = item.user?.icon.bgColor || "transparent";
  const iconSource = getIconSource(item.user?.icon);

  const [isSubCommentsExpanded, setIsSubCommentsExpanded] = useState(false);

  useEffect(() => {
    if (item.lastSubCommentTimestamp) {
      setIsSubCommentsExpanded(true);
    }
  }, [item.lastSubCommentTimestamp]);

  const handleSeeReplies = () => {
    setIsSubCommentsExpanded(!isSubCommentsExpanded);

    if (
      !isSubCommentsExpanded &&
      (!item.subComments || item.subComments.length === 0)
    ) {
      onFetchSubComments(item._id);
    }
  };

  const [commentState, setCommentState] = useState({
    likes: item.likes,
    liked: item.hasLiked,
  });

  useEffect(() => {
    setCommentState({
      likes: item.likes,
      liked: item.hasLiked,
    });
  }, [item.likes, item.hasLiked]);

  const toggleLike = useCallback(async () => {
    const newLikedState = !commentState.liked;
    const newLikesCount = newLikedState
      ? commentState.likes + 1
      : commentState.likes - 1;

    setCommentState((prevState) => ({
      ...prevState,
      likes: newLikesCount,
      liked: newLikedState,
    }));

    try {
      await handleCommentLike(item._id, newLikedState ? "like" : "unlike");
      const commentId = isSubComment
        ? `${item.parentCommentId}-${item._id}`
        : item._id;
      onCommentLikeUpdate(
        commentId,
        newLikesCount,
        newLikedState,
        isSubComment
      );
    } catch (error) {
      setCommentState((prevState) => ({
        ...prevState,
        likes: prevState.likes,
        liked: !newLikedState,
      }));
      console.error("Error toggling comment like:", error);
    }
  }, [
    item._id,
    item.parentCommentId,
    commentState.liked,
    commentState.likes,
    onCommentLikeUpdate,
    isSubComment,
  ]);

  return (
    <View style={styles.container}>
      {/* icon */}
      <Pressable
        style={[styles.icon, { marginLeft: isSubComment ? 0 : 10 }]}
        onPress={() => navigation(item?.userId)}
      >
        <Image
          source={iconSource}
          style={[styles.icon, { backgroundColor: iconBgColor }]}
        />
      </Pressable>

      <View style={styles.contentWrapper}>
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
          {!isSubComment && (
            <Pressable onPress={() => onReply(item.user.displayName, item._id)}>
              <Text style={styles.replyText}>Reply</Text>
            </Pressable>
          )}

          {isSubCommentsExpanded &&
            item.subComments &&
            item.subComments.length > 0 && (
              <View style={styles.subCommentsContainer}>
                {item.subComments.map((subComment) => (
                  <CommentItem
                    key={subComment._id}
                    item={subComment}
                    navigation={navigation}
                    colors={colors}
                    onReply={onReply}
                    isSubComment={true}
                    onCommentLikeUpdate={onCommentLikeUpdate}
                  />
                ))}
              </View>
            )}

          {/* see sub comments */}
          {item.hasSubComment && (
            <Pressable onPress={handleSeeReplies}>
              <Text style={styles.otherReplyText}>
                {isSubCommentsExpanded ? "Hide replies" : "See other replies"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* like count */}
        <View style={styles.likeInfo}>
          <Text style={styles.likes}>{commentState.likes}</Text>
          <TouchableOpacity onPress={toggleLike}>
            <Icon
              name={commentState.liked ? "heart" : "heart-outline"}
              size={14}
              color={commentState.liked ? "#FF4433" : "grey"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(CommentItem);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 10,
    position: "relative",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  textInfo: {
    flex: 1,
    justifyContent: "center",
  },
  displayName: { fontWeight: "bold", fontSize: 16 },
  timeAgo: { color: "grey", fontSize: 14, paddingLeft: 10 },
  content: { fontSize: 14, marginRight: 40 },
  followStatus: { color: "grey" },
  likeInfo: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  likes: { fontSize: 14, color: "grey" },
  replyText: { fontSize: 12, color: "grey" },
  otherReplyText: {
    marginLeft: 20,
    marginTop: 10,
    color: "grey",
    fontSize: 14,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: 6,
  },
});
