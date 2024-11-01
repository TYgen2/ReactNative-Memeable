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

// fetch all posts, including first load, load more and refresh
export const fetchAllPosts = createAsyncThunk(
  "user/fetchAllPosts",
  async ({ page, limit, reset }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/fetchAllPosts", {
        params: { page, limit },
      });

      console.log("Posts fetched using REDUX!!");
      return { ...response.data, reset };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// handling follow actions
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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// update displayName, username and userBio in user profile
export const handleUpdateGradient = createAsyncThunk(
  "user/handleUpdateGradient",
  async ({ gradientConfig }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/handleUpdateGradient", {
        gradientConfig,
      });

      console.log("Updated Gradient using REDUX!!");
      return response.data;
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
      return response.data;
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
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// update song in user profile
export const handleUpdateSong = createAsyncThunk(
  "user/handleUpdateSong",
  async ({ imageUri, songUri, songName }, { rejectWithValue }) => {
    const formData = new FormData();

    if (imageUri) {
      const imageType = imageUri.endsWith(".png") ? "image/png" : "image/jpeg";
      formData.append("albumImage", {
        uri: imageUri,
        type: imageType,
        name: "albumImage",
      });
    }

    if (songUri) {
      const songType = songUri.endsWith(".mp3") ? "audio/mpeg" : "audio/wav";
      formData.append("songAudio", {
        uri: songUri,
        type: songType,
        name: "songAudio",
      });
    }

    if (songName) {
      formData.append("songName", songName);
    }

    try {
      const response = await apiClient.post("/handleUpdateSong", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Updated song using REDUX!!");
      return response.data;
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
