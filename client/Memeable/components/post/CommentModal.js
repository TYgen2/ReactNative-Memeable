import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import CommentInput from "./comment/CommentInput";
import { Image, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect } from "react";
import CommentItem from "./comment/CommentItem";
import { LOADING_INDICATOR } from "../../utils/constants";

const CommentModal = ({
  bottomSheetModalRef,
  comments,
  isCommentLoading,
  loadMoreComments,
  isLoadingMore,
  onChange,
  handleNewComment,
  fetchSubComments,
  onCommentLikeUpdate,
  handleDeleteComment,
  replyInfo,
  setReplyInfo,
  colors,
  postId,
  userIcon,
  userIconBgColor,
  navigateAndCloseModal,
  navigation,
}) => {
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const renderCommentItem = useCallback(
    ({ item }) => {
      const commentData = comments[item];
      if (!commentData) return null;

      return (
        <CommentItem
          item={commentData}
          navigation={navigateAndCloseModal}
          colors={colors}
          isSubComment={false}
          onReply={(username, commentId) => {
            setReplyInfo({ username, commentId });
          }}
          onFetchSubComments={fetchSubComments}
          onCommentLikeUpdate={onCommentLikeUpdate}
          onDeleteComment={handleDeleteComment}
        />
      );
    },
    [comments, navigation, colors, setReplyInfo]
  );

  const renderEmpty = () => {
    if (isCommentLoading) return <LOADING_INDICATOR />;
    return (
      <View style={styles.emptyComment}>
        <Image
          source={require("../../assets/empty_icon/xueyi.png")}
          style={{ width: 100, height: 100, opacity: 0.4 }}
        />
        <Text style={styles.emptyText}>No comment yet...Zzz</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return <LOADING_INDICATOR />;
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={["80%"]}
      backdropComponent={renderBackdrop}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      onChange={(index) => {
        onChange(index);
      }}
      backgroundStyle={{ backgroundColor: colors.primary }}
      handleIndicatorStyle={{ backgroundColor: colors.secondary }}
    >
      <View style={styles.commentModalContent}>
        <BottomSheetFlatList
          data={Object.keys(comments)}
          renderItem={renderCommentItem}
          refreshing={isCommentLoading}
          onEndReached={loadMoreComments}
          contentContainerStyle={styles.commentList}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
        />
        <View style={styles.inputContainer}>
          <CommentInput
            postId={postId}
            userIcon={userIcon}
            userIconBgColor={userIconBgColor}
            onCommentPosted={handleNewComment}
            colors={colors}
            replyInfo={replyInfo}
            onReplyComplete={() => setReplyInfo(null)}
          />
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  commentModalContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  inputContainer: {
    width: "100%",
  },
  commentList: { flexGrow: 1 },
  emptyComment: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontWeight: "bold", fontSize: 24, color: "grey" },
});

export default CommentModal;
