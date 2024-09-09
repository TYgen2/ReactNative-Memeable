import axios from "axios";
import { LOCAL_HOST } from "@env";
import { storeTokens } from "../utils/tokenActions";

// local register
export const userRegister = async (json) => {
  try {
    const res = await axios.post(`${LOCAL_HOST}/api/auth/register`, json);
    const { token, refreshToken, isNew, userId } = res.data;
    await storeTokens(token, refreshToken);

    console.log("User registered and logged in successfully!");
    return { success: true, refreshToken, isNew, userId };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// local login
export const userLogin = async (json) => {
  try {
    const res = await axios.post(`${LOCAL_HOST}/api/auth/login`, json);
    const { token, refreshToken, isNew, userId } = res.data;
    await storeTokens(token, refreshToken);

    console.log("User logged in successfully!");
    return { success: true, refreshToken, isNew, userId };
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
    const { token, refreshToken, isNew, userId } = res.data;
    await storeTokens(token, refreshToken);

    console.log("User logged in successfully!");
    return { success: true, refreshToken, isNew, userId };
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
    const { token, refreshToken, isNew, userId } = res.data;
    await storeTokens(token, refreshToken);

    console.log("User logged in successfully!");
    return { success: true, refreshToken, isNew, userId };
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};

// validate whether JWT and refreshToken expired or not
export const validateTokens = async (oldJwtToken, oldRefreshToken) => {
  // when user have not these tokens, meaning that they are not logged in yet
  if (!oldJwtToken || !oldRefreshToken) {
    return {
      success: false,
      message: "Not yet login in, navigating to login page!",
    };
  }

  try {
    const res = await axios.post(
      `${LOCAL_HOST}/api/auth/token-validation`,
      {},
      {
        headers: {
          Authorization: `Bearer ${oldJwtToken}`,
          "x-refresh-token": oldRefreshToken,
        },
      }
    );

    // if JWT is still valid, nothing will be returned, proceed to stay login
    if (!res.data.refreshToken) {
      return { success: true, message: "JWT still valid, stay login!!" };
    } else {
      // JWT is expired, and refreshToken is still valid,
      // proceed to generatea new pair of token, and then
      // store it in localStorage and global state
      const { token, refreshToken } = res.data;
      await storeTokens(token, refreshToken);
      return {
        success: true,
        refreshToken,
        message: "JWT expired but refreshToken is still alive, stay login!!",
      };
    }
  } catch (error) {
    return { success: false, message: error.response.data.msg };
  }
};
