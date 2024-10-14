import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native";

const dimensions = Dimensions.get("screen");
export const screenWidth = dimensions.width;
export const screenHeight = dimensions.height;
export const barOffset = StatusBar.currentHeight;

export const googleLoginConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
};

export const DEFAULT_ICONS = [
  {
    id: "doge",
    source: require("../assets/default_icon/doge.png"),
    isDefault: true,
  },
  {
    id: "homer",
    source: require("../assets/default_icon/homer.png"),
    isDefault: true,
  },
  {
    id: "im_fine",
    source: require("../assets/default_icon/im_fine.png"),
    isDefault: true,
  },
  {
    id: "pikachu",
    source: require("../assets/default_icon/pikachu.png"),
    isDefault: true,
  },
  {
    id: "polite_cat",
    source: require("../assets/default_icon/polite_cat.png"),
    isDefault: true,
  },
  {
    id: "think",
    source: require("../assets/default_icon/think.png"),
    isDefault: true,
  },
];

export const ICON_BGCOLOR = [
  "white",
  "black",
  "yellow",
  "red",
  "orange",
  "green",
  "purple",
  "cyan",
  "pink",
  "grey",
];

export const DEFAULT_BGIMAGE = require("../assets/default_bgImage.jpg");

export const DEFAULT_SONGIMAGE = require("../assets/default_songImg.jpg");

export const LOADING_INDICATOR = () => {
  return (
    <View style={styles.center}>
      <ActivityIndicator size={24} color={"grey"} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
