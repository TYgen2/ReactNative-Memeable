import { useRef, useState } from "react";
import { getTokens } from "../../utils/tokenActions";
import { useDispatch } from "react-redux";
import { handleUpdateIcon } from "../../store/userActions";

export default useUpdateIcon = (iconData) => {
  const [newIcon, setNewIcon] = useState(iconData);
  const initialIconRef = useRef(iconData);
  const dispatch = useDispatch();

  const updateIconInfo = async () => {
    if (newIcon !== initialIconRef.current) {
      console.log("Proceed to update icon info!!");
      try {
        const tokens = await getTokens();
        dispatch(
          handleUpdateIcon({
            icon: newIcon.customIcon,
            jwtToken: tokens.jwtToken,
            refreshToken: tokens.refreshToken,
          })
        );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
  };

  return { newIcon, setNewIcon, updateIconInfo };
};
