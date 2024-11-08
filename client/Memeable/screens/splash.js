import { useContext, useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { UpdateContext } from "../context/loading";
import { validateTokens } from "../handleAPIs/auth";
import { useDispatch } from "react-redux";
import { reduxLogout } from "../store/userReducer";
import { clearPosts } from "../store/postReducer";
import { clearTokens } from "../utils/tokenActions";

const Splash = () => {
  const { setIsLoading } = useContext(UpdateContext);
  const dispatch = useDispatch();

  const checkStatus = async () => {
    const res = await validateTokens();
    console.log(res.message);

    if (res.success === false) {
      await clearTokens();
      dispatch(reduxLogout());
      dispatch(clearPosts());
    }

    // state that controls which stack should be displayed
    setIsLoading(false);
  };

  const iconS = useSharedValue(0.5);
  const iconO = useSharedValue(0);
  const reanimatedIcon = useAnimatedStyle(() => {
    return {
      opacity: iconO.value,
      transform: [{ scale: iconS.value }],
    };
  }, []);

  const start = () => {
    iconO.value = withTiming(1, { duration: 1500 });
    iconS.value = withTiming(1, { duration: 1500 }, (isFinished) => {
      if (isFinished) runOnJS(checkStatus)();
    });
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, reanimatedIcon]}>
        <Image
          source={require("../assets/adaptive-icon.png")}
          style={{ width: 300, height: 300 }}
        />
      </Animated.View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 300,
    height: 300,
  },
});
