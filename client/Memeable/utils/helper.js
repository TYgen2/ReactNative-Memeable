import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Keychain from "react-native-keychain";

// validate whether JWT and refreshToken expired or not
export const checkLoginStatus = async () => {
  try {
    const token = await AsyncStorage.getItem("jwt");
    if (token) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking login status!!", error);
    return false;
  }
};

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

export const storeTokens = async (jwtToken, refreshToken) => {
  await Keychain.setGenericPassword("jwtToken", jwtToken, {
    service: "jwtToken",
  });
  await Keychain.setGenericPassword("refreshToken", refreshToken, {
    service: "refreshToken",
  });
};

export const getTokens = async () => {
  const jwt = await Keychain.getGenericPassword({
    service: "jwtToken",
  });
  const refresh = await Keychain.getGenericPassword({
    service: "refreshToken",
  });
  return { jwtToken: jwt.password, refreshToken: refresh.password };
};

export const clearTokens = async () => {
  await Keychain.resetGenericPassword({ service: "jwtToken" });
  await Keychain.resetGenericPassword({ service: "refreshToken" });
};
