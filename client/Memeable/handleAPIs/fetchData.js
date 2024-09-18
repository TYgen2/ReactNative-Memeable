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
    return rejectWithValue(error.response.data);
  }
};
