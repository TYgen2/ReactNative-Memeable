import { Animated, Image, StyleSheet } from "react-native";

export default EffectiveGIF = ({ gif }) => {
  return (
    <Animated.View style={[styles.gif, { opacity: gif }]}>
      <Image
        source={require("../assets/effective.gif")}
        style={{ width: 200, resizeMode: "contain" }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gif: {
    position: "absolute",
    zIndex: 1,
    right: 0,
    top: 20,
  },
});
