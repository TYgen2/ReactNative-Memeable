import { useEffect, useState } from "react";
import { DEFAULT_ICONS } from "../../utils/constants";
import { Animated } from "react-native";
import { hideGIF } from "../../utils/animation";
import { useDispatch } from "react-redux";
import { handleIconUpload } from "../../handleAPIs/userActions";
import { fetchUserInfo } from "../../store/userActions";

const useEditProfile = () => {
  const dispatch = useDispatch();

  const [icon, setIcon] = useState(DEFAULT_ICONS[0]);
  const [customIcon, setCustomIcon] = useState(null);
  const [bgColor, setBgColor] = useState("white");
  const [gif] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (icon != DEFAULT_ICONS[1].source || customIcon) {
      hideGIF(gif);
    }
  }, [icon, customIcon]);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const iconJSON = {
        id: icon.id,
        bgColor,
        customIcon,
      };
      await handleIconUpload(iconJSON);

      dispatch(fetchUserInfo());
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    icon,
    bgColor,
    customIcon,
    gif,
    isLoading,
    setCustomIcon,
    setIcon,
    setBgColor,
    handleContinue,
  };
};

export default useEditProfile;
