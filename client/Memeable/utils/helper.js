import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { fetchUserInfo } from "../api/userActions";

// validate whether JWT and refreshToken expired or not
// export const checkLoginStatus = async () => {
//   try {
//     const token = await AsyncStorage.getItem("jwt");
//     if (token) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.error("Error checking login status!!", error);
//     return false;
//   }
// };

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
  const userInfo = await fetchUserInfo({
    jwtToken,
    refreshToken,
    userId,
  });
  dispatch(reduxSetUserInfo(userInfo));
};
