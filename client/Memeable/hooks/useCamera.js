import { useCallback, useState } from "react";
import { useCameraPermissions } from "expo-camera";

export default useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState("back");
  const [flashMode, setFlashMode] = useState(false);

  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }, []);

  const toggleFlash = useCallback(() => {
    setFlashMode((prevMode) => (prevMode === false ? true : false));
  }, []);

  return {
    permission,
    requestPermission,
    facing,
    flashMode,
    toggleCameraFacing,
    toggleFlash,
  };
};
