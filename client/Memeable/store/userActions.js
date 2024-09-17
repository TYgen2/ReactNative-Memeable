import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/axiosHelper";

// fetch local user info and store in Redux
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/fetchUserInfo");

      console.log("Global state updated using REDUX!!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// fetch posts, including first load, load more and refresh
export const fetchPosts = createAsyncThunk(
  "user/fetchPosts",
  async ({ page, limit, mode, since, reset }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/fetchPosts", {
        params: { page, limit, mode, since },
      });

      console.log("Posts fetched using REDUX!!");
      return { ...response.data, reset };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// handling follow action
export const handleFollow = createAsyncThunk(
  "user/handleFollow",
  async ({ targetId, action }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/handleFollow", {
        targetId,
        action,
      });

      console.log("Follow updated using REDUX!!");
      return { msg: response.data.msg };
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

// update displayName, username and userBio in user profile
export const handleUpdateStrings = createAsyncThunk(
  "user/handleUpdateStrings",
  async ({ displayName, username, userBio }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/handleUpdateStrings", {
        displayName,
        username,
        userBio,
      });

      console.log("Updated Strings using REDUX!!");
      return { msg: response.data.msg };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// update bgImage in user profile
export const handleUpdateBgImage = createAsyncThunk(
  "user/handleUpdateBgImage",
  async ({ bgImage }, { rejectWithValue }) => {
    const formData = new FormData();
    const fileType = bgImage.endsWith(".png") ? "image/png" : "image/jpeg";
    formData.append("file", {
      uri: bgImage,
      type: fileType,
      name: "image",
    });

    try {
      const response = await apiClient.post("/handleUpdateBgImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Updated bgImage using REDUX!!");
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
  async ({ icon }, { rejectWithValue }) => {
    const formData = new FormData();
    const fileType = icon.endsWith(".png") ? "image/png" : "image/jpeg";
    formData.append("file", {
      uri: icon,
      type: fileType,
      name: "image",
    });

    try {
      const response = await apiClient.post("/handleUpdateIcon", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Updated icon using REDUX!!");
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
  async ({ imageUri, title, description, hashtag }, { rejectWithValue }) => {
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
      const response = await apiClient.post("/handleUploadPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Updated userPosts using REDUX!!");
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
