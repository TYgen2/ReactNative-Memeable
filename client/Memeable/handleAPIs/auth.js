import axios from "axios";
import { LOCAL_HOST } from "@env";
import { clearTokens, storeTokens } from "../utils/tokenActions";
import apiClient from "../utils/axiosHelper";

// local register
export const userRegister = async (json) => {
  try {
    const res = await axios.post(`${LOCAL_HOST}/api/auth/register`, json);
    const { isNew, userId } = res.data;
    const token = res.headers["x-new-token"];
    const refreshToken = res.headers["x-new-refresh-token"];
    await storeTokens(token, refreshToken);

    console.log("User registered and logged in successfully!");
    return { success: true, isNew, userId };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// local login
export const userLogin = async (json) => {
  try {
    const res = await axios.post(`${LOCAL_HOST}/api/auth/login`, json);
    const { isNew, userId } = res.data;
    const token = res.headers["x-new-token"];
    const refreshToken = res.headers["x-new-refresh-token"];
    await storeTokens(token, refreshToken);

    console.log("User logged in successfully!");
    return { success: true, isNew, userId };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// google login
export const googleLogin = async (idToken) => {
  try {
    const res = await axios.post(`${LOCAL_HOST}/api/auth/google`, {
      idToken,
    });
    const { isNew, userId } = res.data;
    const token = res.headers["x-new-token"];
    const refreshToken = res.headers["x-new-refresh-token"];
    console.log({ token, refreshToken });
    await storeTokens(token, refreshToken);

    console.log("User logged in successfully!");
    return { success: true, isNew, userId };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// facebook login
export const facebookLogin = async (accessToken) => {
  try {
    const res = await axios.post(`${LOCAL_HOST}/api/auth/facebook`, {
      accessToken,
    });
    const { isNew, userId } = res.data;
    const token = res.headers["x-new-token"];
    const refreshToken = res.headers["x-new-refresh-token"];
    await storeTokens(token, refreshToken);

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
    await apiClient.post("/auth/logout");
    await clearTokens();

    console.log("User logged out successfully!");
  } catch (error) {
    console.error(error);
  }
};
