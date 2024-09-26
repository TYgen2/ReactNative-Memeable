import { useState } from "react";
import useUpdateBgImage from "../updateUserProfile/useUpdateBgImage";
import useUpdateIcon from "../updateUserProfile/useUpdateIcon";
import useUpdateStrings from "../updateUserProfile/useUpdateStrings";

export const useEditUserProfileViewModel = (initialData) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { newBgImage, setNewBgImage, updateBgImageInfo } = useUpdateBgImage(
    initialData.bgImageSource
  );
  const { newIcon, setNewIcon, updateIconInfo } = useUpdateIcon(
    initialData.userIcon
  );
  const {
    displayName,
    setDisplayName,
    username,
    setUsername,
    userBio,
    setUserBio,
    updateStringInfo,
  } = useUpdateStrings({
    displayName: initialData.displayName,
    username: initialData.username,
    userBio: initialData.userBio,
  });

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      const results = await Promise.allSettled([
        updateStringInfo(),
        updateBgImageInfo(),
        updateIconInfo(),
      ]);

      const allSuccessful = results.every((result) => {
        if (result.status === "fulfilled") {
          return (
            result.value === undefined ||
            result.value?.meta?.requestStatus === "fulfilled"
          );
        }
        return false;
      });

      return allSuccessful;
    } catch (error) {
      console.log("Error in handleUpdateProfile:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    newBgImage,
    setNewBgImage,
    newIcon,
    setNewIcon,
    displayName,
    setDisplayName,
    username,
    setUsername,
    userBio,
    setUserBio,
    handleUpdateProfile,
    isUpdating,
  };
};
