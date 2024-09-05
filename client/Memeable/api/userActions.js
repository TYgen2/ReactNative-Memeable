import axios from "axios";
import axiosRetry from "axios-retry";
import { LOCAL_HOST } from "@env";
import { storeTokens } from "../utils/tokenActions";

axiosRetry(axios, { retries: 3 });

// send image data to backend for posting
export const handlePostUpload = async (
  imageUri,
  title,
  description,
  hashtag,
  jwtToken,
  refreshToken,
  dispatch,
  setJwt,
  setRefresh
) => {
  if (imageUri) {
    const formData = new FormData();
    const fileType = imageUri.endsWith(".png") ? "image/png" : "image/jpeg";
    formData.append("file", {
      uri: imageUri,
      type: fileType,
      name: "image",
    });
    formData.append("title", title);
    formData.append("description", description);
    formData.append("hashtag", hashtag);
    formData.append("jwtToken", jwtToken);
    formData.append("refreshToken", refreshToken);

    try {
      const res = await axios.post(`${LOCAL_HOST}/api/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // when user's jwtToken is expired, but refreshToken is still valid,
      // backend will return a new pair of token, and needs update global
      if (res.data.token && res.data.refreshToken) {
        dispatch(setJwt(res.data.token));
        dispatch(setRefresh(res.data.refreshToken));
        console.log("Tokens updated in Global");
      }
      console.log(res.data.msg);
    } catch (error) {
      console.error(error.response.data);
    }
  }
};

// send icon data to backend for update profile icon
export const handleIconUpload = async (
  userId,
  icon,
  jwtToken,
  refreshToken
) => {
  // using default icons
  if (icon.customIcon == null) {
    try {
      const res = await axios.post(`${LOCAL_HOST}/api/uploadDefaultIcon`, {
        userId,
        icon,
        jwtToken,
        refreshToken,
      });
      // when user's jwtToken is expired, but refreshToken is still valid,
      // backend will return a new pair of token, and needs update global
      if (res.data.token && res.data.refreshToken) {
        storeTokens(res.data.token, res.data.refreshToken);
        console.log("Tokens updated during uploading icon");
      }
      console.log(res.data.msg);
    } catch (error) {
      console.error(error.response.data);
    }
  } else {
    // using custom icons
    const imageUri = icon.customIcon;
    const formData = new FormData();
    const fileType = imageUri.endsWith(".png") ? "image/png" : "image/jpeg";
    formData.append("file", {
      uri: imageUri,
      type: fileType,
      name: "image",
    });
    formData.append("userId", userId);
    formData.append("icon", imageUri);
    formData.append("jwtToken", jwtToken);
    formData.append("refreshToken", refreshToken);

    try {
      const res = await axios.post(
        `${LOCAL_HOST}/api/uploadCustomIcon`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.token && res.data.refreshToken) {
        storeTokens(res.data.token, res.data.refreshToken);
        console.log("Tokens updated during uploading icon");
      }
      console.log(res.data.msg);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Request error:", error.request);
      } else {
        // Something else happened
        console.error("Error:", error.message);
      }
    }
  }
};

export const fetchUserInfo = async (json) => {
  try {
    const res = await axios.post(`${LOCAL_HOST}/api/fetchUserInfo`, json);
    const { email, userId, displayName, userIcon } = res.data;

    console.log("User info fetched!");
    return { email, userId, displayName, userIcon };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};
