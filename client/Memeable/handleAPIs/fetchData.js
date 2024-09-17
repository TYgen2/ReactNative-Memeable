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
