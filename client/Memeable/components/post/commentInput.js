import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { memo, useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { handleComment } from "../../handleAPIs/userActions";

const CommentInput = memo(
  ({
    postId,
    userIcon,
    userIconBgColor,
    onCommentPosted,
    colors,
    replyInfo,
    onReplyComplete,
  }) => {
    const [comment, setComment] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (replyInfo) {
        setComment(`@${replyInfo.username} `);
      } else {
        setComment("");
      }
    }, [replyInfo]);

    const submitComment = useCallback(async () => {
      let isSubComment = false;
      let finalComment = comment.trim();

      if (replyInfo && finalComment.startsWith(`@${replyInfo.username}`)) {
        isSubComment = true;
      }

      console.log(isSubComment ? "sub comment" : "main comment");
      const res = await handleComment(
        postId,
        isSubComment ? replyInfo.commentId : null,
        finalComment
      );
      if (res.comment) {
        onCommentPosted(res.comment);
        setComment("");
        onReplyComplete();
      }
    }, [postId, comment, onCommentPosted, replyInfo, onReplyComplete]);

    return (
      <View style={styles.commentInputContainer}>
        <View style={styles.userIconContainer}>
          <FastImage
            source={userIcon}
            style={[styles.userIcon, { backgroundColor: userIconBgColor }]}
          />
        </View>
        <BottomSheetTextInput
          style={[styles.commentInputField, { color: colors.text }]}
          placeholder="Add a comment..."
          placeholderTextColor="grey"
          autoCorrect={false}
          autoCapitalize="none"
          value={comment}
          onChangeText={(text) => setComment(text)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <View
          style={[
            styles.postButtonContainer,
            { backgroundColor: colors.tertiary },
          ]}
        >
          <TouchableOpacity style={styles.postButton} onPress={submitComment}>
            <Text style={[styles.commentButtonText, { color: colors.text }]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  commentInputContainer: {
    flexDirection: "row",
    height: 60,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentInputField: {
    flex: 1,
    marginHorizontal: 6,
  },
  userIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  postButtonContainer: {
    width: 60,
    height: 40,
    borderRadius: 20,
  },
  postButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commentButtonText: {
    fontWeight: "bold",
  },
});

export default CommentInput;
