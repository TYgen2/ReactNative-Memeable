import * as dotenv from "dotenv";
dotenv.config();

export default {
  expo: {
    name: "Memeable",
    slug: "Memeable",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      softwareKeyboardLayoutMode: "pan",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.tychow45.memeable",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "9203708c-9d1a-4702-ab67-a806199306f8",
      },
    },
    scheme: "com.tychow45.memeable",
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow Memeable to access your camera",
          microphonePermission: "Allow Memeable to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      ["expo-image-picker"],
      [
        "react-native-fbsdk-next",
        {
          appID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
          displayName: "Memeable",
          clientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN,
          scheme: "com.tychow45.memeable",
        },
      ],
    ],
  },
};
