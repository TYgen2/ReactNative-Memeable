import { Animated } from "react-native";

export const popInAnimations = (icon_bottom, icon_opacity, icon_1, icon_2) => {
  Animated.timing(icon_bottom, {
    toValue: 70,
    duration: 500,
    useNativeDriver: false,
  }).start();
  Animated.timing(icon_opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();
  Animated.timing(icon_1, {
    toValue: 120,
    duration: 500,
    useNativeDriver: false,
  }).start();
  Animated.timing(icon_2, {
    toValue: 120,
    duration: 500,
    useNativeDriver: false,
  }).start();
};

export const popOutAnimations = (icon_bottom, icon_opacity, icon_1, icon_2) => {
  Animated.timing(icon_bottom, {
    toValue: 40,
    duration: 500,
    useNativeDriver: false,
  }).start();
  Animated.timing(icon_opacity, {
    toValue: 0,
    duration: 500,
    useNativeDriver: false,
  }).start();
  Animated.timing(icon_1, {
    toValue: 170,
    duration: 500,
    useNativeDriver: false,
  }).start();
  Animated.timing(icon_2, {
    toValue: 170,
    duration: 500,
    useNativeDriver: false,
  }).start();
};

export const showGIF = (gif) => {
  Animated.timing(gif, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();
};

export const hideGIF = (gif) => {
  Animated.timing(gif, {
    toValue: 0,
    duration: 10,
    useNativeDriver: false,
  }).start();
};
