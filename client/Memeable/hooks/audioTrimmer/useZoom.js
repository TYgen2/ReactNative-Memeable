import { useState, useCallback } from "react";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "../../constants/audioConstants";

export const useZoom = () => {
  const [zoom, setZoom] = useState(MIN_ZOOM);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }, []);

  return {
    zoom,
    handleZoomIn,
    handleZoomOut,
  };
};
