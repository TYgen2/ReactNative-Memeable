import { useCallback, useMemo, useState } from "react";
import { handleLike, handleSavePost } from "../../handleAPIs/userActions";
import { PostModel } from "../../models/PostModel";

export const usePostViewModel = (initialPostData) => {
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

    await handleLike(postModel.id, postState.liked ? "unlike" : "like");
  }, [postModel.id, postState.liked]);

  const toggleSave = useCallback(async () => {
    setPostState((prevState) => ({
      ...prevState,
      saved: !prevState.saved,
    }));

    await handleSavePost(postModel.id, postState.saved ? "unsave" : "save");
  }, [postModel.id, postState.saved]);

  return {
    post: postModel,
    postState,
    toggleLike,
    toggleSave,
  };
};
