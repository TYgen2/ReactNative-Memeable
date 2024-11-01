import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";

const GlowingBorder = ({ gradientConfig, width, height }) => {
  // Create two borders with different animation delays
  const borders = [0, 1].map((index) => {
    const progress = useSharedValue(0);

    useEffect(() => {
      progress.value = withDelay(
        index * 500,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 500 }),
            withTiming(0, { duration: 500 })
          ),
          -1,
          true
        )
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: progress.value,
        transform: [{ scale: 1 + progress.value * 0.1 }],
      };
    });

    return (
      <Animated.View key={index} style={[styles.animatedBorder, animatedStyle]}>
        <LinearGradient
          colors={gradientConfig.colors}
          start={gradientConfig.start}
          end={gradientConfig.end}
          style={styles.gradientBorder}
        />
      </Animated.View>
    );
  });

  return <View style={[styles.container, { width, height }]}>{borders}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  animatedBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  gradientBorder: {
    flex: 1,
    borderRadius: 12,
  },
});

export default GlowingBorder;
