import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useFetchComments from "../hooks/fetchData/useFetchComments";
import { handleLike, handleSavePost } from "../handleAPIs/userActions";
import { useSelector } from "react-redux";
import { PostModel } from "../models/PostModel";

export const usePostViewModel = (initialPostData) => {
  const { userDetails } = useSelector((state) => state.user);

  const postModel = useMemo(
    () => new PostModel(initialPostData).toJSON(),
    [initialPostData]
  );

  const [postState, setPostState] = useState({
    likes: postModel.likes,
    liked: postModel.hasLiked,
    saved: false,
  });

  // update local like status and like count
  const toggleLike = useCallback(async () => {
    setPostState((prevState) => ({
      ...prevState,
      liked: !prevState.liked,
      likes: prevState.liked ? prevState.likes - 1 : prevState.likes + 1,
    }));

    await handleLike(initialPostData._id, postState.liked ? "unlike" : "like");
  }, [postModel.id, postState.liked]);

  const toggleSave = useCallback(async () => {
    setPostState((prevState) => ({
      ...prevState,
      saved: !prevState.saved,
    }));

    await handleSavePost(
      initialPostData._id,
      postState.saved ? "unsave" : "save"
    );
  }, [postModel.id, postState.saved]);

  const {
    comments,
    setComments,
    isCommentLoading,
    fetchCommentsForPost,
    loadMoreComments,
    isLoadingMore,
    fetchSubComments,
  } = useFetchComments(postModel.id);

  const onChange = useCallback(
    (index) => {
      if (index === 0 && Object.keys(comments).length === 0) {
        console.log("fetching comments..");
        fetchCommentsForPost(1);
      }
    },
    [fetchCommentsForPost, comments]
  );

  const commentsRef = useRef(comments);

  // Update the ref whenever comments change
  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

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
    post: postModel,
    postState,
    toggleLike,
    toggleSave,
    comments,
    setComments,
    isCommentLoading,
    fetchCommentsForPost,
    isLoadingMore,
    loadMoreComments,
    onChange,
    handleNewComment,
    fetchSubComments,
    onCommentLikeUpdate,
  };
};
