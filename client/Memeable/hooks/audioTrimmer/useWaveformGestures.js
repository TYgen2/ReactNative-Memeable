import { useRef, useMemo, useState } from "react";
import { PanResponder } from "react-native";
import {
  MAX_TRIM_DURATION,
  MIN_TRIM_DURATION,
} from "../../constants/audioConstants";

export const useWaveformGestures = ({
  zoom,
  duration,
  leftTrim,
  rightTrim,
  containerWidth,
  onTrimChange,
  onPositionChange,
  onPlaybackStateChange,
  currentPosition,
}) => {
  const trimmerRef = useRef(null);
  const leftHandleRef = useRef(null);
  const rightHandleRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const createPanResponder = (isLeft, isMiddle = false) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Stop playback when starting to drag
        if (isMiddle || isLeft) {
          onPlaybackStateChange(false);
        }
      },
      onPanResponderMove: (_, gesture) => {
        const pixelsPerMs = (containerWidth * zoom) / duration;
        const msMove = gesture.dx / pixelsPerMs;

        if (isMiddle) {
          // Moving the entire trimming area
          const trimDuration = rightTrim - leftTrim;
          let newLeft = Math.max(0, leftTrim + msMove);
          let newRight = Math.min(duration, newLeft + trimDuration);

          if (newRight === duration) {
            newLeft = duration - trimDuration;
          }

          onTrimChange(newLeft, newRight);
          onPositionChange(newLeft); // Update current position to match left trim
        } else if (isLeft) {
          // Moving the left handle
          const newLeft = Math.max(0, leftTrim + msMove);
          const currentDuration = rightTrim - newLeft;

          if (currentDuration > MAX_TRIM_DURATION) {
            // Don't update position if we've hit the maximum duration
            onTrimChange(rightTrim - MAX_TRIM_DURATION, rightTrim);
          } else if (currentDuration < MIN_TRIM_DURATION) {
            // Don't update position if we've hit the minimum duration
            onTrimChange(rightTrim - MIN_TRIM_DURATION, rightTrim);
          } else {
            onTrimChange(newLeft, rightTrim);
            onPositionChange(newLeft); // Only update position when within valid range
          }
        } else {
          // Moving the right handle
          const newRight = Math.min(duration, rightTrim + msMove);
          const currentDuration = newRight - leftTrim;

          if (currentDuration > MAX_TRIM_DURATION) {
            onTrimChange(leftTrim, leftTrim + MAX_TRIM_DURATION);
          } else if (currentDuration < MIN_TRIM_DURATION) {
            onTrimChange(leftTrim, leftTrim + MIN_TRIM_DURATION);
          } else {
            onTrimChange(leftTrim, newRight);
          }
          // Don't update current position for right handle
        }
      },
      onPanResponderRelease: () => {
        // Handle release if needed
      },
    });
  };

  const panResponders = useMemo(
    () => ({
      leftPanResponder: createPanResponder(true),
      rightPanResponder: createPanResponder(false),
      middlePanResponder: createPanResponder(false, true),
    }),
    [createPanResponder]
  );

  const playbackPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setIsDragging(true);
          onPositionChange(currentPosition, true);
        },
        onPanResponderMove: (_, gesture) => {
          const pixelsPerMs = (containerWidth * zoom) / duration;
          const msMove = gesture.dx / pixelsPerMs;
          const newPosition = Math.max(
            leftTrim,
            Math.min(rightTrim, currentPosition + msMove)
          );
          onPositionChange(newPosition);
        },
        onPanResponderRelease: () => {
          setIsDragging(false);
          onPositionChange(currentPosition, false);
        },
      }),
    [currentPosition, leftTrim, rightTrim, duration, containerWidth, zoom]
  );

  return {
    trimmerRef,
    handleRefs: {
      leftHandle: leftHandleRef,
      rightHandle: rightHandleRef,
    },
    panResponders: {
      leftPanResponder: panResponders.leftPanResponder,
      rightPanResponder: panResponders.rightPanResponder,
      middlePanResponder: panResponders.middlePanResponder,
      playbackPanResponder: playbackPanResponder,
    },
    isDragging,
  };
};
