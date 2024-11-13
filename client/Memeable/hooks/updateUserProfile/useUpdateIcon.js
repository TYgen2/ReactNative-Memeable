import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { handleUpdateIcon } from "../../store/actions/userActions";
import { apiQueue } from "../../utils/helper";

export default useUpdateIcon = (iconData) => {
  const [newIcon, setNewIcon] = useState(iconData);
  const initialIconRef = useRef(iconData);
  const dispatch = useDispatch();

  const updateIconInfo = async () => {
    if (newIcon !== initialIconRef.current) {
      console.log("Proceed to update icon info!!");
      try {
        return await apiQueue.add(() =>
          dispatch(
            handleUpdateIcon({
              icon: newIcon.customIcon,
            })
          )
        );
      } catch (error) {
        console.error("Error when updating user profile", error.message);
      }
    }
    return Promise.resolve();
  };

  return { newIcon, setNewIcon, updateIconInfo };
};
