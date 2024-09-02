import { Animated } from "react-native";

export const popInAnimations = (icon_bottom, icon_opacity, icon_1, icon_2) => {
  Animated.timing(icon_bottom, {
    toValue: 120,
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

export const popOutAnimations = (
  icon_bottom,
  icon_opacity,
  icon_1,
  icon_2,
  icon_3
) => {
  Animated.timing(icon_bottom, {
    toValue: 70,
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
