import { CameraView } from "expo-camera";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import PermissionRequest from "./PermissionRequest";
import { useRef } from "react";
import useCamera from "../../hooks/useCamera";

const CameraComponent = ({ navigation }) => {
  const cameraRef = useRef(null);
  const {
    permission,
    requestPermission,
    facing,
    flashMode,
    toggleCameraFacing,
    toggleFlash,
  } = useCamera();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return <PermissionRequest requestPermission={requestPermission} />;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      navigation.navigate("Upload", { imageUri: photo.uri });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        enableTorch={flashMode}
        videoQuality="2160p"
      >
        <View style={styles.buttonContainer}>
          {/* Flip button */}
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Icon name="camera-reverse-outline" size={40} color="white" />
          </TouchableOpacity>

          {/* Capture button */}
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          {/* Flash button */}
          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            <Icon name="flash-outline" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  flipButton: {
    position: "absolute",
    left: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  flashButton: {
    position: "absolute",
    right: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
