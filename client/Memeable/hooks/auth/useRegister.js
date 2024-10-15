import { useState } from "react";
import { userRegister } from "../../handleAPIs/auth";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async (json) => {
    setIsLoading(true);
    try {
      // calling register API for getting JWT token
      const res = await userRegister(json);

      // retreive the saved JWT token from localStorage
      // and store it to global state
      if (res.success) {
        navigation.replace("Edit Profile", { userId: res.userId });
      } else {
        Alert.alert("Register failed: ", res.message);
      }
    } catch (error) {
      Alert.alert("Unexpected error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleRegister };
};

export default useRegister;
