import AsyncStorage from "@react-native-async-storage/async-storage";

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
