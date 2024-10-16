import axios from "axios";
import axiosRetry from "axios-retry";
import apiClient from "../utils/axiosHelper";

axiosRetry(axios, { retries: 3 });

// send icon data to backend for update profile icon
export const handleIconUpload = async (icon) => {
  // using default icons
  if (icon.customIcon == null) {
    console.log("Now upload icon with default icons");
    try {
      const res = await apiClient.post("/uploadDefaultIcon", {
        icon,
      });

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
    formData.append("icon", imageUri);

    try {
      console.log("Now upload icon with custom icons");
      const res = await apiClient.post("/uploadCustomIcon", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

export const handleSearch = async (query) => {
  try {
    const res = await apiClient.get("/searchUser", {
      params: { query },
    });
    const searchRes = res.data;
    return { searchRes };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};

export const handleLike = async (postId, action) => {
  try {
    const res = await apiClient.post("/handleLike", { postId, action });

    console.log("Like updated locally!");
    return { msg: res.data.msg };
  } catch (error) {
    return { msg: error.response.data.msg };
  }
};

export const handleSavePost = async (postId, action) => {
  try {
    const res = await apiClient.post("/handleSavePost", { postId, action });

    console.log("Post saved/unsaved!");
    return { msg: res.data.msg };
  } catch (error) {
    return { msg: error.response.data.msg };
  }
};

export const handleComment = async (postId, parentCommentId, content) => {
  try {
    const res = await apiClient.post("/handleComment", {
      postId,
      parentCommentId,
      content,
    });
    const { msg, comment } = res.data;

    console.log("Commented successfully!");
    return { msg, comment };
  } catch {
    return { msg: error.response.data.msg };
  }
};
