import { useCallback, useEffect, useRef, useState } from "react";
import useFetchComments from "../fetchData/useFetchComments";
import { useSelector } from "react-redux";

export const useCommentViewModel = (postId) => {
  const { userDetails } = useSelector((state) => state.user);

  const [replyInfo, setReplyInfo] = useState(null);
  const commentsRef = useRef(comments);

  const {
    comments,
    setComments,
    isCommentLoading,
    fetchCommentsForPost,
    loadMoreComments,
    isLoadingMore,
    fetchSubComments,
  } = useFetchComments(postId);

  // Update the ref whenever comments change
  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  // initial fetch
  const onChange = useCallback(
    (index) => {
      if (index === 0 && Object.keys(comments).length === 0) {
        console.log("fetching comments..");
        fetchCommentsForPost(1);
      }
    },
    [fetchCommentsForPost, comments]
  );

  // handle new comment
  const handleNewComment = useCallback(
    (newComment) => {
      const enhancedComment = {
        ...newComment,
        user: {
          displayName: userDetails.displayName,
          icon: userDetails.userIcon,
        },
        hasLiked: false,
        subComments: [],
      };

      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        if (newComment.parentCommentId) {
          const parentComment = updatedComments[newComment.parentCommentId];
          if (parentComment) {
            updatedComments[newComment.parentCommentId] = {
              ...parentComment,
              subComments: [
                enhancedComment,
                ...(parentComment.subComments || []),
              ],
              hasSubComment: true,
            };
          }
        } else {
          return {
            [enhancedComment._id]: enhancedComment,
            ...prevComments, // Spread the existing comments after the new one
          };
        }
        return prevComments;
      });
    },
    [userDetails]
  );

  const onCommentLikeUpdate = useCallback(
    (commentId, newLikesCount, newLikedState, isSubComment = false) => {
      setComments((prevComments) => {
        const updatedComments = { ...prevComments };
        if (isSubComment) {
          const [parentId, subId] = commentId.split("-");
          const parentComment = updatedComments[parentId];
          if (parentComment) {
            updatedComments[parentId] = {
              ...parentComment,
              subComments: parentComment.subComments.map((subComment) =>
                subComment._id === subId
                  ? {
                      ...subComment,
                      likes: newLikesCount,
                      hasLiked: newLikedState,
                    }
                  : subComment
              ),
            };
          }
        } else {
          if (updatedComments[commentId]) {
            updatedComments[commentId] = {
              ...updatedComments[commentId],
              likes: newLikesCount,
              hasLiked: newLikedState,
            };
          }
        }
        return updatedComments;
      });
    },
    []
  );

  return {
    comments,
    isCommentLoading,
    loadMoreComments,
    isLoadingMore,
    onChange,
    handleNewComment,
    fetchSubComments,
    onCommentLikeUpdate,
    replyInfo,
    setReplyInfo,
  };
};
