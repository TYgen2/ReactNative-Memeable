import { useRef, useState } from "react";
import { getTokens } from "../../utils/tokenActions";
import { useDispatch } from "react-redux";
import { handleUpdateBgImage } from "../../store/userActions";

export default useUpdateBgImage = (bgImageData) => {
  const [newBgImage, setNewBgImage] = useState(bgImageData);
  const initialBgImageRef = useRef(bgImageData);
  const dispatch = useDispatch();

  const updateBgImageInfo = async () => {
    if (newBgImage !== initialBgImageRef.current) {
      console.log("Proceed to update bgImage info!!");
      try {
        const tokens = await getTokens();
        dispatch(
          handleUpdateBgImage({
            bgImage: newBgImage,
            jwtToken: tokens.jwtToken,
            refreshToken: tokens.refreshToken,
          })
        );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
  };

  return { newBgImage, setNewBgImage, updateBgImageInfo };
};
