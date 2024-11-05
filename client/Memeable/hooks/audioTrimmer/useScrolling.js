import { useState, useEffect, useCallback, useRef } from "react";
import { Dimensions } from "react-native";

export const useScrolling = (zoom) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get("window").width
  );

  const contentWidth = containerWidth * zoom;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const maxScroll = Math.max(0, contentWidth - scrollViewWidth);
    if (scrollPosition > maxScroll) {
      const newScrollPosition = maxScroll;
      setScrollPosition(newScrollPosition);
      scrollViewRef.current?.scrollTo({
        x: newScrollPosition,
        animated: false,
      });
    }
  }, [zoom, contentWidth, scrollViewWidth, scrollPosition]);

  const handleScroll = useCallback((event) => {
    setScrollPosition(event.nativeEvent.contentOffset.x);
  }, []);

  const handleLayout = useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
    setScrollViewWidth(width);
  }, []);

  return {
    scrollViewRef,
    containerWidth,
    contentWidth,
    handleScroll,
    handleLayout,
  };
};
