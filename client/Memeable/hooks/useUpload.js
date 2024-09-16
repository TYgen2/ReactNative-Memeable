import { useState } from "react";
import { getTokens } from "../utils/tokenActions";
import { useDispatch } from "react-redux";
import { handleUploadPost } from "../store/userActions";

export default useUpload = (imageUri) => {
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  // handle post upload
  const uploadPost = async (values) => {
    setIsUploading(true);
    try {
      const tokens = await getTokens();
      dispatch(
        handleUploadPost({
          imageUri,
          title: values.title,
          description: values.description,
          hashtag: values.hashtag,
          jwtToken: tokens.jwtToken,
          refreshToken: tokens.refreshToken,
        })
      );
    } catch (error) {
      console.error(error.response?.data?.msg || "Error when uploading post");
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, setIsUploading, uploadPost };
};
