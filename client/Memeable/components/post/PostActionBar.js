import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { displayLikes } from "../../utils/helper";
import PostDeleteButton from "./PostDeleteButton";

const PostActionBar = ({
  postState,
  toggleLike,
  toggleSave,
  openCommentModal,
  commentCount,
  colors,
  fromProfile,
  isOwnPost,
  postId,
  onDeleteSuccess,
}) => {
  return (
    <View style={styles.rightsideBar}>
      {/* save icon */}
      <TouchableOpacity onPress={toggleSave}>
        <Icon
          name={postState.saved ? "bookmark" : "bookmark-outline"}
          size={32}
          color={colors.inactiveIcon}
        />
      </TouchableOpacity>

      {/* Only show delete button if viewing from profile and it's user's own post */}
      {fromProfile && isOwnPost && (
        <PostDeleteButton postId={postId} onDeleteSuccess={onDeleteSuccess} />
      )}

      {/* like, comment */}
      <View style={styles.actionsContainer}>
        {/* like button */}
        <View style={styles.center}>
          <Text style={{ color: colors.text }}>
            {displayLikes(postState.likes)}
          </Text>
          <TouchableOpacity onPress={toggleLike}>
            <Icon
              name={postState.liked ? "heart" : "heart-outline"}
              size={32}
              color={postState.liked ? "#FF4433" : colors.inactiveIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.center}>
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              paddingBottom: 2,
            }}
          >
            {commentCount}
          </Text>
          <TouchableOpacity onPress={openCommentModal}>
            <Icon
              name="chatbox-ellipses-outline"
              size={32}
              color={colors.inactiveIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(PostActionBar);

const styles = StyleSheet.create({
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
  footerLoader: {
    paddingVertical: 30,
    alignItems: "center",
  },
  subCommentContainer: {
    paddingLeft: 40,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
});
