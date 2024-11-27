import { useCallback, useMemo, useState } from "react";
import { PostModel } from "../../models/PostModel";
import { useDispatch } from "react-redux";
import {
  handleLikePost,
  handleSavePost,
} from "../../store/actions/userActions";
import { usePostInteractions } from "../fetchData/usePostInteractions";
import { ToastAndroid } from "react-native";

export const usePostViewModel = (initialPostData) => {
  const postModel = useMemo(
    () => new PostModel(initialPostData).toJSON(),
    [initialPostData]
  );

  const dispatch = useDispatch();
  const interactions = usePostInteractions(postModel.id);

  // Initialize state with interactions data if available
  const [postState, setPostState] = useState({
    likes: interactions?.likes ?? 0,
    liked: interactions?.hasLiked ?? false,
    saved: interactions?.isSaved ?? false,
  });

  const toggleLike = useCallback(async () => {
    const action = postState.liked ? "unlike" : "like";

    setPostState((prevState) => ({
      ...prevState,
      liked: !prevState.liked,
      likes: prevState.liked ? prevState.likes - 1 : prevState.likes + 1,
    }));

    try {
      await dispatch(
        handleLikePost({
          postId: postModel.id,
          action,
        })
      ).unwrap();
    } catch (error) {
      // Revert on error
      setPostState((prevState) => ({
        ...prevState,
        liked: !prevState.liked,
        likes: prevState.liked ? prevState.likes - 1 : prevState.likes + 1,
      }));
      console.error("Error toggling like:", error);
      ToastAndroid.show("Cannot like post, INTERNAL ERROR", ToastAndroid.SHORT);
    }
  }, [postModel.id, postState.liked, dispatch]);

  const toggleSave = useCallback(async () => {
    const action = postState.saved ? "unsave" : "save";
    setPostState((prevState) => ({
      ...prevState,
      saved: !prevState.saved,
    }));

    try {
      await dispatch(
        handleSavePost({
          postId: postModel.id,
          action,
        })
      ).unwrap();
    } catch (error) {
      // Revert on error
      setPostState((prevState) => ({
        ...prevState,
        saved: !prevState.saved,
      }));
      console.error("Error toggling save:", error);
    }
  }, [postModel.id, postState.saved, dispatch]);

  return {
    post: postModel,
    postState,
    toggleLike,
    toggleSave,
  };
};
