import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { googleLoginConfig } from "../../utils/constants";
import { useEffect, useState } from "react";
import { facebookLogin, googleLogin, userLogin } from "../../handleAPIs/auth";
import { apiQueue } from "../../utils/helper";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { fetchUserInfo } from "../../store/actions/userActions";

WebBrowser.maybeCompleteAuthSession();

const useLogin = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (method, payload) => {
    let loginFunction;
    switch (method) {
      case "Local":
        loginFunction = () => userLogin(payload);
        break;
      case "Google":
        loginFunction = () => googleLogin(payload);
        break;
      case "Facebook":
        loginFunction = () => facebookLogin(payload);
        break;
      default:
        return;
    }

    setIsLoading(true);
    try {
      const res = await apiQueue.add(loginFunction);

      if (!res.success) {
        Alert.alert(`${method} login failed: `, res.message);
        return;
      }
      console.log(`Logged in with ${method} method!`);

      await apiQueue.add(() => {
        if (res.isNew) {
          navigation.replace("Edit Profile", { userId: res.userId });
        } else {
          // User exist, proceed to fetch user info before login
          dispatch(fetchUserInfo());
        }
      });
    } catch (error) {
      Alert.alert("Unexpected error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [request, response, promptAsync] =
    Google.useAuthRequest(googleLoginConfig);

  const handleFacebook = async () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      (res) => {
        if (res.grantedPermissions) {
          AccessToken.getCurrentAccessToken().then((data) => {
            handleLogin("Facebook", data.accessToken);
          });
        } else {
          console.log("Facebook login failed WTF???");
        }
      }
    );
  };

  useEffect(() => {
    // handle google login
    if (response?.type == "success") {
      const { authentication } = response;
      const idToken = authentication?.idToken;

      handleLogin("Google", idToken);
    }
  }, [response]);

  return { isLoading, handleLogin, promptAsync, handleFacebook };
};

export default useLogin;
