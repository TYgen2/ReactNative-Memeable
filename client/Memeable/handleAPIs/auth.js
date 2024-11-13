import axios from "axios";
import { clearTokens, storeTokens } from "../utils/tokenActions";
import apiClient from "../utils/axiosHelper";
import { getPushToken, sendPushTokenToServer } from "./firebaseFCM";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const handleTokens = async (res) => {
  // save the returned tokens using react-native-keychain
  const token = res.headers["x-new-token"];
  const refreshToken = res.headers["x-new-refresh-token"];
  await storeTokens(token, refreshToken);

  // get push token, then send it to the server to store in the database
  const pushToken = await getPushToken();
  const response = await sendPushTokenToServer(pushToken);
  console.log(response.msg);
};

// local register
export const userRegister = async (json) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/auth/register`, json);
    const { isNew, userId } = res.data;
    await handleTokens(res);

    console.log("User registered and logged in successfully!");
    return { success: true, isNew, userId };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// local login
export const userLogin = async (json) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/auth/login`, json);
    const { isNew, userId } = res.data;
    await handleTokens(res);

    console.log("User logged in successfully!");
    return { success: true, isNew, userId };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// google login
export const googleLogin = async (idToken) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/auth/google`, {
      idToken,
    });
    const { isNew, userId } = res.data;
    await handleTokens(res);

    console.log("User logged in successfully!");
    return { success: true, isNew, userId };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// facebook login
export const facebookLogin = async (accessToken) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/auth/facebook`, {
      accessToken,
    });
    const { isNew, userId } = res.data;
    await handleTokens(res);

    console.log("User logged in successfully!");
    return { success: true, isNew, userId };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// validate whether JWT and refreshToken expired or not
export const validateTokens = async () => {
  try {
    const res = await apiClient.post("/auth/token-validation");
    return { success: res.data.success, message: res.data.msg };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// logout
export const userLogout = async () => {
  try {
    const pushToken = await getPushToken();
    if (!pushToken) {
      throw new Error("Push token not available");
    }

    await apiClient.post(
      "/auth/logout",
      {},
      {
        headers: {
          "x-push-token": pushToken,
        },
      }
    );

    await clearTokens();

    console.log("User logged out successfully!");
  } catch (error) {
    console.error(error);
  }
};
