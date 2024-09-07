import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DEFAULT_ICONS } from "../utils/constants";

export default TabItem = ({ onPress, isFocused, routeName, label }) => {
  const scale = useSharedValue(0);
  const { userInfo } = useSelector((state) => state.user);
  const iconBgColor = userInfo?.userIcon?.bgColor || "orange";
  // check customIcon, if null, check defaultIcon. If still null,
  // it means user accidentally closed app during editting profile,
  // fallback using a default icon with orange background and doge.
  const iconSource = userInfo
    ? userInfo.userIcon.customIcon
      ? { uri: userInfo.userIcon.customIcon }
      : DEFAULT_ICONS.find((icon) => icon.id === userInfo.userIcon.id)
          ?.source || DEFAULT_ICONS[0].source
    : DEFAULT_ICONS[0].source;

  const icon = {
    UserStack: (props) => <MCIcon name="home" size={30} {...props} />,
    Search: (props) => <IonIcon name="search" size={30} {...props} />,
    Notify: (props) => <IonIcon name="notifications" size={30} {...props} />,
  };

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 10]);
    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top: top,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  return (
    <TouchableOpacity
      style={{
        marginRight: routeName == "Search" ? 30 : 0,
        marginLeft: routeName == "Notify" ? 30 : 0,
      }}
      onPress={onPress}
    >
      {/* Home, Search, Notify tabs */}
      {routeName != "UserProfile" ? (
        <Animated.View
          style={[{ flex: 1, alignItems: "center" }, animatedIconStyle]}
        >
          {icon[routeName]({
            color: isFocused ? "#5D3FD3" : "black",
          })}
          <Animated.Text
            style={[
              {
                color: isFocused ? "red" : "black",
              },
              animatedTextStyle,
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      ) : (
        // User profile tab
        <View
          style={{
            marginBottom: 4,
          }}
        >
          <View
            style={[
              styles.iconBorder1,
              { backgroundColor: isFocused ? "#5D3FD3" : "black" },
            ]}
          >
            <View style={styles.iconBorder2}>
              <Image
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 40,
                  backgroundColor: iconBgColor,
                }}
                source={iconSource}
              />
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconBorder1: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  iconBorder2: {
    height: 45,
    width: 45,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
  },
});
