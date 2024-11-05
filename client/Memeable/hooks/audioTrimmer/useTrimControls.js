import { useState, useEffect, useCallback } from "react";
import { clamp } from "../../utils/audioTrimmer/mathHelpers";
import {
  MIN_TRIM_DURATION,
  MAX_TRIM_DURATION,
} from "../../constants/audioConstants";

export const useTrimControls = (duration, onTrimsChange) => {
  const [trimState, setTrimState] = useState({
    left: 0,
    right: Math.min(duration, MAX_TRIM_DURATION),
  });

  useEffect(() => {
    onTrimsChange?.(trimState.left, trimState.right);
  }, [trimState, onTrimsChange]);

  const updateTrim = useCallback(
    (isLeft, newPosition) => {
      setTrimState((prev) => {
        const { left, right } = prev;

        if (isLeft) {
          const maxLeft = right - MIN_TRIM_DURATION;
          const minLeft = right - MAX_TRIM_DURATION;
          return {
            ...prev,
            left: clamp(newPosition, Math.max(0, minLeft), maxLeft),
          };
        } else {
          const minRight = left + MIN_TRIM_DURATION;
          const maxRight = left + MAX_TRIM_DURATION;
          return {
            ...prev,
            right: clamp(newPosition, minRight, Math.min(duration, maxRight)),
          };
        }
      });
    },
    [duration]
  );

  const onTrimChange = useCallback((left, right) => {
    setTrimState({ left, right });
  }, []);

  return {
    leftTrim: trimState.left,
    rightTrim: trimState.right,
    updateTrim,
    onTrimChange,
  };
};
