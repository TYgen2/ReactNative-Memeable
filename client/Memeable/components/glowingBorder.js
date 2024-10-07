import React, { memo, useEffect } from "react";
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

export default GlowingBorder = memo(({ boxStyle, color }) => {
  const rotation = useSharedValue(0);
  const GLOW_COLOR = color + "FF";
  const GLOW_BG_COLOR = color + "00"; // Should be the same color as GLOW_COLOR but fully transparent

  const centerX = boxStyle.width / 2;
  const centerY = boxStyle.height / 2;
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
      <RoundedRect
        r={10}
        x={0}
        y={0}
        width={boxStyle.width}
        height={boxStyle.height}
      >
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
    <Canvas style={boxStyle}>
      <GlowGradient />
    </Canvas>
  );
});
