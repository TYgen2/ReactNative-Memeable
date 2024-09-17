import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { handleUpdateIcon } from "../../store/userActions";

export default useUpdateIcon = (iconData) => {
  const [newIcon, setNewIcon] = useState(iconData);
  const initialIconRef = useRef(iconData);
  const dispatch = useDispatch();

  const updateIconInfo = () => {
    if (newIcon !== initialIconRef.current) {
      console.log("Proceed to update icon info!!");
      try {
        dispatch(
          handleUpdateIcon({
            icon: newIcon.customIcon,
          })
        );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
  };

  return { newIcon, setNewIcon, updateIconInfo };
};
