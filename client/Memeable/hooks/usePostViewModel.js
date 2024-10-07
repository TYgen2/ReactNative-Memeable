import { useCallback, useMemo, useState } from "react";
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
  } = useFetchComments(postModel.id);

  const onChange = useCallback(
    (index) => {
      if (index === 0 && comments.length === 0) {
        console.log("fetching comments..");
        fetchCommentsForPost(1);
      }
    },
    [fetchCommentsForPost, comments.length]
  );

  const handleNewComment = useCallback(
    (newComment) => {
      const enhancedComment = {
        ...newComment,
        user: {
          displayName: userDetails.displayName,
          icon: userDetails.userIcon,
        },
        userId: userDetails.userId,
      };

      setComments((prevComments) => [enhancedComment, ...prevComments]);
    },
    [userDetails]
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
  };
};
