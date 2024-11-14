import { useCallback, useEffect, useState } from "react";
import { handleLike, handleSavePost } from "../../handleAPIs/userActions";
import { PostModel } from "../../models/PostModel";
import { getTimeDifference } from "../../utils/helper";

export const usePostViewModel = (initialPostData) => {
  const [postModel, setPostModel] = useState(() =>
    new PostModel(initialPostData).toJSON()
  );

  const [postState, setPostState] = useState({
    likes: postModel.likes,
    liked: postModel.hasLiked,
    saved: false,
  });

  // Update timeAgo periodically
  useEffect(() => {
    const updateTimeAgo = () => {
      setPostModel((prevPost) => ({
        ...prevPost,
        timeAgo: getTimeDifference(prevPost.createDate),
      }));
    };

    const intervalId = setInterval(updateTimeAgo, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

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
