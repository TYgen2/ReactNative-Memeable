import axios from "axios";
import { LOCAL_HOST } from "@env";

// fetch User profile info
export const fetchProfile = async (targetId, jwtToken, refreshToken) => {
  try {
    const res = await axios.get(`${LOCAL_HOST}/api/fetchUserProfile`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "x-refresh-token": refreshToken,
      },
      params: { targetId },
    });
    return { userData: res.data };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};

// fetch posts (user's or following's)
export const handleFetchPosts = async (
  page,
  limit,
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
      params: { page, limit, mode },
    });
    const postData = res.data;

    return { postData };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};
