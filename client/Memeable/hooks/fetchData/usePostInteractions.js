import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  handleLikePost,
  handleSavePost,
} from "../../store/actions/userActions";
import { fetchPostStatus } from "../../handleAPIs/fetchData";

export const usePostInteractions = (postId) => {
  const dispatch = useDispatch();
  const interactions = useSelector(
    (state) => state.interaction.interactions[postId]
  );

  useEffect(() => {
    if (!interactions) {
      fetchPostStatus(postId).then((status) => {
        dispatch(
          handleLikePost.fulfilled({
            postId,
            likeAction: status.hasLiked ? "like" : "unlike",
            likes: status.likes,
          })
        );
        if (status.isSaved) {
          dispatch(handleSavePost.fulfilled({ postId, saveAction: "save" }));
        }
      });
    }
  }, [postId, interactions, dispatch]);

  return interactions;
};
