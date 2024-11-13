import messaging from "@react-native-firebase/messaging";
import apiClient from "../utils/axiosHelper";

export const getPushToken = async () => {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
  }
};

export const sendPushTokenToServer = async (pushToken) => {
  try {
    const res = await apiClient.put("/handleUpdatePushToken", { pushToken });
    const { msg } = res.data;

    console.log("push token sent to database successfully!");
    return { msg };
  } catch (error) {
    console.error("Error sending push token:", error);
    return { msg: error.response.data.msg };
  }
};
