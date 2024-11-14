import { useCallback, useEffect, useRef, useState } from "react";
import useFetchComments from "../fetchData/useFetchComments";
import { useSelector } from "react-redux";
import { handleCommentDelete } from "../../handleAPIs/userActions";

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
        if (newComment.parentCommentId) {
          // Handle sub-comment
          const parentComment = prevComments[newComment.parentCommentId];
          if (!parentComment) return prevComments;

          return {
            ...prevComments,
            [newComment.parentCommentId]: {
              ...parentComment,
              subComments: [
                enhancedComment,
                ...(parentComment.subComments || []),
              ],
              hasSubComment: true,
              lastSubCommentTimestamp: new Date().toISOString(),
            },
          };
        } else {
          // Handle parent comment
          return {
            [enhancedComment._id]: enhancedComment,
            ...prevComments,
          };
        }
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

  const handleDeleteComment = useCallback(
    async (commentId, parentCommentId) => {
      try {
        await handleCommentDelete(commentId, parentCommentId);

        // Update local state
        const updatedComments = { ...comments };
        if (parentCommentId) {
          // Handle sub-comment deletion
          const parentComment = updatedComments[parentCommentId];
          if (parentComment) {
            parentComment.subComments = parentComment.subComments.filter(
              (comment) => comment._id !== commentId
            );
            // Update hasSubComment based on remaining subComments
            parentComment.hasSubComment = parentComment.subComments.length > 0;
          }
        } else {
          // Handle main comment deletion
          delete updatedComments[commentId];
        }
        setComments(updatedComments);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    },
    [comments]
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
    handleDeleteComment,
  };
};
