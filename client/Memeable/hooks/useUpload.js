import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleUploadPost } from "../store/actions/userActions";

export default useUpload = (imageUri) => {
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  // handle post upload
  const uploadPost = async (values) => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      dispatch(
        handleUploadPost({
          imageUri,
          title: values.title,
          description: values.description,
          hashtag: values.hashtag,
        })
      )
        .then(() => {
          setIsUploading(false);
          resolve();
        })
        .catch((error) => {
          setIsUploading(false);
          console.error(
            error.response?.data?.msg || "Error when uploading post"
          );
          reject(error);
        });
    });
  };

  return { isUploading, setIsUploading, uploadPost };
};
