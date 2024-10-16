import { memo, useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { getIconSource } from "../../utils/helper";
import { useSelector } from "react-redux";
import { usePostViewModel } from "../../hooks/viewModel/usePostViewModel";
import { useCommentViewModel } from "../../hooks/viewModel/useCommentViewModel";
import CommentModal from "./CommentModal";
import PostContent from "./PostContent";
import PostActionBar from "./PostActionBar";

// User post component
export default MainPost = memo(({ item, navigation, colors }) => {
  const { userDetails } = useSelector((state) => state.user);
  const myIcon = getIconSource(userDetails?.userIcon);

  const { post, postState, toggleLike, toggleSave } = usePostViewModel(item);
  const commentViewModel = useCommentViewModel(item._id);

  const bottomSheetModalRef = useRef(null);
  const openCommentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const navigateAndCloseModal = (targetId) => {
    bottomSheetModalRef.current?.close();
    navigation.push("UserProfile", { isStack: true, targetId });
  };

  return (
    <View style={styles.postContainer}>
      <PostContent post={post} navigation={navigation} colors={colors} />
      <PostActionBar
        postState={postState}
        toggleLike={toggleLike}
        toggleSave={toggleSave}
        openCommentModal={openCommentModal}
        commentCount={post.commentCount}
        colors={colors}
      />
      <CommentModal
        bottomSheetModalRef={bottomSheetModalRef}
        {...commentViewModel}
        colors={colors}
        postId={item._id}
        userIcon={myIcon}
        navigateAndCloseModal={navigateAndCloseModal}
        navigation={navigation}
      />
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
});
