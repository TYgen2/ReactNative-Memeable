import { memo } from "react";
import { StyleSheet, View } from "react-native";
import PostDeleteButton from "./PostDeleteButton";
import SaveButton from "./SaveButton";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";

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
      <SaveButton
        isSaved={postState.saved}
        toggleSave={toggleSave}
        colors={colors}
      />

      {/* Only show delete button if viewing from profile and it's user's own post */}
      {fromProfile && isOwnPost && (
        <PostDeleteButton postId={postId} onDeleteSuccess={onDeleteSuccess} />
      )}

      <View style={styles.actionsContainer}>
        <LikeButton
          likes={postState.likes}
          isLiked={postState.liked}
          toggleLike={toggleLike}
          colors={colors}
        />
        <CommentButton
          count={commentCount}
          openCommentModal={openCommentModal}
          colors={colors}
        />
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
});
