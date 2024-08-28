import { useContext, useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { UpdateContext } from "../context/loading";
import { validateTokens } from "../api/auth";
import { setRefresh } from "../store/tokenReducer";

export default Splash = () => {
  const { setIsLoading } = useContext(UpdateContext);
  const { jwtToken, refreshToken } = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const checkStatus = async () => {
    const res = await validateTokens(jwtToken, refreshToken);

    // JWT expired, receiving a new pair of tokens,
    // store them in global state (local already stored
    // in the validateTokens API)
    if (res.success === true && res.refreshToken) {
      dispatch(setRefresh(res.refreshToken));
      console.log(res.message);
    } else if (res.success) {
      // JWT still valid, stay login
      console.log(res.message);
    } else {
      // not login in yet / both JWT and refreshToken are expired
      console.log(res.message);
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
