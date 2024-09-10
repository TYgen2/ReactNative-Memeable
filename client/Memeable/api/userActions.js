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
  refreshToken
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

    try {
      const res = await axios.post(`${LOCAL_HOST}/api/uploadPost`, formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "x-refresh-token": refreshToken,
          "Content-Type": "multipart/form-data",
        },
      });

      // when user's jwtToken is expired, but refreshToken is still valid,
      // backend will return a new pair of token, and needs update global
      if (res.data.token && res.data.refreshToken) {
        await storeTokens(res.data.token, res.data.refreshToken);
        console.log("Tokens updated");
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
      const res = await axios.post(
        `${LOCAL_HOST}/api/uploadDefaultIcon`,
        {
          userId,
          icon,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );
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

    try {
      const res = await axios.post(
        `${LOCAL_HOST}/api/uploadCustomIcon`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "x-refresh-token": refreshToken,
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

// fetch user info before login
export const fetchUserInfo = async (id, jwtToken, refreshToken) => {
  try {
    const res = await axios.post(
      `${LOCAL_HOST}/api/fetchUserInfo`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "x-refresh-token": refreshToken,
        },
      }
    );
    const { email, userId, displayName, userIcon } = res.data;

    console.log("User info fetched!");
    return { email, userId, displayName, userIcon };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};

// fetch additional user info in user profile
export const fetchProfile = async (
  userId,
  targetId,
  jwtToken,
  refreshToken
) => {
  try {
    const res = await axios.get(`${LOCAL_HOST}/api/fetchUserProfile`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "x-refresh-token": refreshToken,
      },
      params: { userId, targetId },
    });
    const {
      followersCount,
      followingCount,
      postsCount,
      isFollowing,
      displayName,
      userIcon,
    } = res.data;

    return {
      followersCount,
      followingCount,
      postsCount,
      isFollowing,
      displayName,
      userIcon,
    };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};

// handle like / unlike
export const handleLike = async (userId, postId, jwtToken, refreshToken) => {
  try {
    const res = await axios.post(
      `${LOCAL_HOST}/api/handleLike`,
      { userId, postId },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "x-refresh-token": refreshToken,
        },
      }
    );

    return { msg: res.data.msg };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};

// fetch posts
export const handleFetchPosts = async (
  page,
  limit,
  userId,
  mode,
  jwtToken,
  refreshToken
) => {
  try {
    const res = await axios.get(`${LOCAL_HOST}/api/fetchPosts`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "x-refresh-token": refreshToken,
      },
      params: { page, limit, userId, mode },
    });
    const postData = res.data;

    return { postData };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};

// handle follow / unfollow
export const handleFollow = async (
  userId,
  targetId,
  action,
  jwtToken,
  refreshToken
) => {
  try {
    const res = await axios.post(
      `${LOCAL_HOST}/api/handleFollow`,
      { userId, targetId, action },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "x-refresh-token": refreshToken,
        },
      }
    );

    return { msg: res.data.msg };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};

export const handleSearch = async (query, jwtToken, refreshToken) => {
  try {
    const res = await axios.get(`${LOCAL_HOST}/api/searchUser`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "x-refresh-token": refreshToken,
      },
      params: { query },
    });
    const searchRes = res.data;
    return { searchRes };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};
