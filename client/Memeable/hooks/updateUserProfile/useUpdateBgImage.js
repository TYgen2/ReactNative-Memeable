import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { handleUpdateBgImage } from "../../store/userActions";

export default useUpdateBgImage = (bgImageData) => {
  const [newBgImage, setNewBgImage] = useState(bgImageData);
  const initialBgImageRef = useRef(bgImageData);
  const dispatch = useDispatch();

  const updateBgImageInfo = () => {
    if (newBgImage !== initialBgImageRef.current) {
      console.log("Proceed to update bgImage info!!");
      try {
        dispatch(
          handleUpdateBgImage({
            bgImage: newBgImage,
          })
        );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
  };

  return { newBgImage, setNewBgImage, updateBgImageInfo };
};
