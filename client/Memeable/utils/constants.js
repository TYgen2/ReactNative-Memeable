import { Dimensions, StatusBar } from "react-native";
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@env";

const dimensions = Dimensions.get("screen");
export const screenWidth = dimensions.width;
export const screenHeight = dimensions.height;
export const barOffset = StatusBar.currentHeight;

export const googleLoginConfig = {
  webClientId: GOOGLE_WEB_CLIENT_ID,
  androidClientId: GOOGLE_ANDROID_CLIENT_ID,
};
