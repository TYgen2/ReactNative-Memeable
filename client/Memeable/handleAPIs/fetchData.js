import apiClient from "../utils/axiosHelper";

// fetch User profile info
export const fetchProfile = async (targetId) => {
  try {
    const res = await apiClient.get("/fetchUserProfile", {
      params: { targetId },
    });
    return { userData: res.data };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};

// fetch user posts
export const fetchUserPosts = async (page, limit, targetId) => {
  try {
    const response = await apiClient.get("/fetchUserPosts", {
      params: { page, limit, targetId },
    });

    return response.data;
  } catch (error) {
    return { message: error.response.data.msg };
  }
};

export const fetchComments = async (page, limit, postId, parentCommentId) => {
  try {
    const response = await apiClient.get("/fetchComments", {
      params: { postId, parentCommentId, page, limit },
    });

    return response.data;
  } catch (error) {
    return { message: error.response?.data?.msg || "Error fetching comments" };
  }
};

// fetch notifications with abort controller support
export const fetchNotifications = async ({ page, limit, signal }) => {
  try {
    const response = await apiClient.get("/fetchNotifications", {
      params: { page, limit },
      signal: signal,
    });

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request cancelled:", error.message);
      return { cancelled: true };
    }
    return {
      message: error.response?.data?.msg || "Error fetching notifications",
    };
  }
};
