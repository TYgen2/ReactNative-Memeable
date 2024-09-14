import { useState } from "react";
import { getTokens } from "../utils/tokenActions";
import { handleUpdate } from "../handleAPIs/userActions";
import { Alert } from "react-native";

export default useUpdateProfile = (data, iconData, bgImage) => {
  const [displayName, setdisplayName] = useState(data.displayName);
  const [username, setUsername] = useState(data.username);
  const [userBio, setUserBio] = useState(data.userBio);

  const [customIcon, setCustomIcon] = useState(null);
  const [newBgImage, setNewBgImage] = useState(null);
  const prevIcon = iconData;
  const prevBgImage = bgImage;

  const [isUpdating, setIsUpdating] = useState(false);

  const updateInfo = async () => {
    setIsUpdating(true);
    try {
      const tokens = await getTokens();
      const res = await handleUpdate(
        displayName,
        username,
        userBio,
        tokens.jwtToken,
        tokens.refreshToken
      );

      if (res.success) {
        console.log(res.message);
      } else {
        if (res.errorType === "validation") {
          Alert.alert("Input data invalid:", res.data[0].msg);
        } else if (res.errorType === "duplicate") {
          Alert.alert("Update failed:", res.message);
        } else {
          console.error("Unknown error:", res.message);
        }
      }
    } catch (error) {
      console.error("Error when updating user profile", error.message);
    }
  };

  return {
    username,
    setUsername,
    displayName,
    setdisplayName,
    customIcon,
    setCustomIcon,
    prevIcon,
    userBio,
    setUserBio,
    newBgImage,
    setNewBgImage,
    prevBgImage,
    updateInfo,
    isUpdating,
  };
};
