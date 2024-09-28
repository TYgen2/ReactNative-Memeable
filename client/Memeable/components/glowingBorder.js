import React, { memo, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  RoundedRect,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const GLOW_COLOR = "#7546b3FF";
const GLOW_BG_COLOR = "#7546b300"; // Should be the same color as GLOW_COLOR but fully transparent

export default GlowingBorder = memo(({ boxWidth, boxHeight }) => {
  const rotation = useSharedValue(0);

  const centerX = boxWidth / 2;
  const centerY = boxHeight / 2;
  const centerVec = vec(centerX, centerY);

  useEffect(() => {
    const animation = withRepeat(
      withTiming(4, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    rotation.value = animation;

    // Cleanup function to stop the animation
    return () => {
      rotation.value = 0; // Reset the rotation value
    };
  }, []);

  const animatedRotation = useDerivedValue(() => {
    return [{ rotate: Math.PI * rotation.value }];
  }, [rotation]);

  const GlowGradient = () => {
    return (
      <RoundedRect r={10} x={0} y={0} width={boxWidth} height={boxHeight}>
        <SweepGradient
          origin={centerVec}
          c={centerVec}
          colors={[GLOW_BG_COLOR, GLOW_COLOR, GLOW_COLOR, GLOW_BG_COLOR]}
          start={0}
          end={360 * 0.7}
          transform={animatedRotation}
        />
      </RoundedRect>
    );
  };

  return (
    <Canvas style={styles.canvas}>
      <GlowGradient />
    </Canvas>
  );
});

const styles = StyleSheet.create({
  canvas: {
    width: 100,
    height: 100,
    position: "absolute",
    right: 0,
    top: 0,
    marginRight: 20,
    marginTop: 20,
  },
});
