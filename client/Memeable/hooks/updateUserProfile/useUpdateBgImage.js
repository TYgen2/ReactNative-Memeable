import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { handleUpdateBgImage } from "../../store/actions/userActions";
import { apiQueue } from "../../utils/helper";

export default useUpdateBgImage = (bgImageData) => {
  const [newBgImage, setNewBgImage] = useState(bgImageData);
  const initialBgImageRef = useRef(bgImageData);
  const dispatch = useDispatch();

  const updateBgImageInfo = async () => {
    if (newBgImage !== initialBgImageRef.current) {
      console.log("Proceed to update bgImage info!!");
      try {
        return await apiQueue.add(() =>
          dispatch(
            handleUpdateBgImage({
              bgImage: newBgImage,
            })
          )
        );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
    return Promise.resolve();
  };

  return { newBgImage, setNewBgImage, updateBgImageInfo };
};
