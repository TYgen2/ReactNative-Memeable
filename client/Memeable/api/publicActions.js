import axios from "axios";
import { LOCAL_HOST } from "@env";

// fetch all posts
export const handleFetchPosts = async (page, limit, userId) => {
  try {
    const res = await axios.get(`${LOCAL_HOST}/api/fetchPosts`, {
      params: { page, limit, userId },
    });
    const postData = res.data;

    return { postData };
  } catch (error) {
    return { message: error.response.data.msg };
  }
};
