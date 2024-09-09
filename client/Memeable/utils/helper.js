import * as ImagePicker from "expo-image-picker";
import { fetchUserInfo } from "../api/userActions";

// select image from album
export const selectImageForUpload = async (setImageUri, navigation) => {
  const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (result.granted === true) {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      selectionLimit: 1,
      quality: 1,
    });

    if (!res.canceled) {
      const { uri } = res.assets[0];
      setImageUri(uri);
      navigation.navigate("UploadStack", {
        screen: "Upload",
        params: { imageUri: uri },
      });
    }
  } else {
    console.log("Access denied / One time only");
  }
};

// select image for profile icon
export const selectImageForProfile = async (setCustomIcon) => {
  const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (result.granted === true) {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      selectionLimit: 1,
      quality: 1,
      aspect: [1, 1],
    });

    if (!res.canceled) {
      const { uri } = res.assets[0];
      setCustomIcon(uri);
    }
  } else {
    console.log("Access denied / One time only");
  }
};

// after login, handlle the fetched data by updating global
export const handleLoginFetch = async (
  jwtToken,
  refreshToken,
  userId,
  dispatch,
  reduxSetUserInfo
) => {
  const userInfo = await fetchUserInfo(userId, jwtToken, refreshToken);
  dispatch(reduxSetUserInfo(userInfo));
};

export const displayLikes = (count) => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1) + "k";
  } else {
    return (count / 1000000).toFixed(1) + "M";
  }
};
