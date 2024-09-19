import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getIconSource } from "../utils/helper";

export default TabItem = ({ onPress, isFocused, routeName, label }) => {
  const scale = useSharedValue(0);

  const { userDetails } = useSelector((state) => state.user);
  const iconBgColor = userDetails.userIcon?.bgColor || "transparent";
  const iconSource = getIconSource(userDetails?.userIcon);

  const icon = {
    HomeStack: (props) => <MCIcon name="home" size={25} {...props} />,
    SearchStack: (props) => <IonIcon name="search" size={25} {...props} />,
    Notify: (props) => <IonIcon name="notifications" size={25} {...props} />,
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
      style={[
        styles.tabContainer,
        {
          marginRight: routeName == "SearchStack" ? 40 : 0,
          marginLeft: routeName == "Notify" ? 40 : 0,
        },
      ]}
      onPress={onPress}
    >
      {/* Home, Search, Notify tabs */}
      {routeName != "UserProfile" ? (
        <Animated.View
          style={[{ flex: 1, alignItems: "center" }, animatedIconStyle]}
        >
          {icon[routeName]({
            color: isFocused ? "#96DED1" : "white",
          })}
          <Animated.Text
            style={[
              {
                color: "white",
                fontSize: 12,
              },
              animatedTextStyle,
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      ) : (
        // User profile tab
        <View style={styles.profileView}>
          <View
            style={[
              styles.iconBorder1,
              { backgroundColor: isFocused ? "#96DED1" : "black" },
            ]}
          >
            <View style={styles.iconBorder2}>
              <Image
                style={[styles.userIcon, { backgroundColor: iconBgColor }]}
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
  tabContainer: {
    width: 45,
    height: 45,
  },
  iconBorder1: {
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
  },
  iconBorder2: {
    height: 30,
    width: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  profileView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  userIcon: {
    height: 25,
    width: 25,
    borderRadius: 25,
  },
});
