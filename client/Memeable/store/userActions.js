import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LOCAL_HOST } from "@env";
import { storeTokens } from "../utils/tokenActions";

// fetch local user info and store in Redux
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async ({ jwtToken, refreshToken }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LOCAL_HOST}/api/fetchUserInfo`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "x-refresh-token": refreshToken,
        },
      });

      console.log("Global state updated using REDUX!!");
      if (response.data.token && response.data.refreshToken) {
        await storeTokens(response.data.token, response.data.refreshToken);
        console.log("Tokens updated");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "user/fetchPosts",
  async (
    { page, limit, mode, since, reset, jwtToken, refreshToken },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${LOCAL_HOST}/api/fetchPosts`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "x-refresh-token": refreshToken,
        },
        params: { page, limit, mode, since },
      });

      console.log("Posts fetched using REDUX!!");
      if (response.data.token && response.data.refreshToken) {
        await storeTokens(response.data.token, response.data.refreshToken);
        console.log("Tokens updated");
      }

      return { ...response.data, reset };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// handling follow action
export const handleFollow = createAsyncThunk(
  "user/handleFollow",
  async ({ targetId, action, jwtToken, refreshToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${LOCAL_HOST}/api/handleFollow`,
        { targetId, action },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      console.log("Follow updated using REDUX!!");
      if (response.data.token && response.data.refreshToken) {
        await storeTokens(response.data.token, response.data.refreshToken);
        console.log("Tokens updated");
      }

      return { msg: response.data.msg };
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

// update displayName, username and userBio in user profile
export const handleUpdateStrings = createAsyncThunk(
  "user/handleUpdateStrings",
  async (
    { displayName, username, userBio, jwtToken, refreshToken },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${LOCAL_HOST}/api/handleUpdateStrings`,
        { displayName, username, userBio },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      console.log("Updated Strings using REDUX!!");
      if (response.data.token && response.data.refreshToken) {
        await storeTokens(response.data.token, response.data.refreshToken);
        console.log("Tokens updated");
      }

      return { msg: response.data.msg };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// update bgImage in user profile
export const handleUpdateBgImage = createAsyncThunk(
  "user/handleUpdateBgImage",
  async ({ bgImage, jwtToken, refreshToken }, { rejectWithValue }) => {
    const formData = new FormData();
    const fileType = bgImage.endsWith(".png") ? "image/png" : "image/jpeg";
    formData.append("file", {
      uri: bgImage,
      type: fileType,
      name: "image",
    });

    try {
      const response = await axios.post(
        `${LOCAL_HOST}/api/handleUpdateBgImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "x-refresh-token": refreshToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated bgImage using REDUX!!");
      if (response.data.token && response.data.refreshToken) {
        await storeTokens(response.data.token, response.data.refreshToken);
        console.log("Tokens updated");
      }

      return {
        msg: response.data.msg,
        updatedBgImage: response.data.updatedBgImage.bgImage,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// update icon in user profile
export const handleUpdateIcon = createAsyncThunk(
  "user/handleUpdateIcon",
  async ({ icon, jwtToken, refreshToken }, { rejectWithValue }) => {
    const formData = new FormData();
    const fileType = icon.endsWith(".png") ? "image/png" : "image/jpeg";
    formData.append("file", {
      uri: icon,
      type: fileType,
      name: "image",
    });

    try {
      const response = await axios.post(
        `${LOCAL_HOST}/api/handleUpdateIcon`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "x-refresh-token": refreshToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated icon using REDUX!!");
      if (response.data.token && response.data.refreshToken) {
        await storeTokens(response.data.token, response.data.refreshToken);
        console.log("Tokens updated");
      }

      return {
        msg: response.data.msg,
        updatedIcon: response.data.updatedIcon.icon,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// handling upload post action
export const handleUploadPost = createAsyncThunk(
  "user/handleUploadPost",
  async (
    { imageUri, title, description, hashtag, jwtToken, refreshToken },
    { rejectWithValue }
  ) => {
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

    try {
      const response = await axios.post(
        `${LOCAL_HOST}/api/handleUploadPost`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "x-refresh-token": refreshToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated userPosts using REDUX!!");
      if (response.data.token && response.data.refreshToken) {
        await storeTokens(response.data.token, response.data.refreshToken);
        console.log("Tokens updated");
      }

      return {
        msg: response.data.msg,
        postData: response.data.postData,
      };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
