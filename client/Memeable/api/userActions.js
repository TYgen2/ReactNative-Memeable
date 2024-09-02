import axios from "axios";
import { LOCAL_HOST } from "@env";

// send image data to backend for posting
export const handleUpload = async (
  imageUri,
  title,
  description,
  hashtag,
  jwtToken,
  refreshToken,
  dispatch,
  setJwt,
  setRefresh
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
    formData.append("jwtToken", jwtToken);
    formData.append("refreshToken", refreshToken);

    try {
      const res = await axios.post(`${LOCAL_HOST}/api/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // when user's jwtToken is expired, but refreshToken is still valid,
      // backend will return a new pair of token, and needs update global
      if (res.data.token && res.data.refreshToken) {
        dispatch(setJwt(res.data.token));
        dispatch(setRefresh(res.data.refreshToken));
        console.log("Tokens updated in Global");
      }
      console.log(res.data.msg);
    } catch (error) {
      console.error(error.response.data);
    }
  }
};
