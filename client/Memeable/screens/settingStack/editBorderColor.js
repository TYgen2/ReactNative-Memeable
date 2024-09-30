import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import GlowingBorder from "../../components/glowingBorder";
import UserSongCover from "../../components/userProfile/userSongCover";
import { useState } from "react";
import { debounce } from "lodash";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const GLOW_BORDER_STYLE = {
  width: 250,
  height: 250,
  marginRight: 0,
  marginTop: 0,
  position: "absolute",
  right: null,
  top: null,
};

export default EditBorderColor = ({ route, navigation }) => {
  console.log("edit border page rendered");
  const { img, borderColor, onColorChange } = route.params;
  const [currentColor, setCurrentColor] = useState(borderColor);

  const handleColorChange = debounce((color) => setCurrentColor(color), 100);

  const handleApply = () => {
    onColorChange(currentColor);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <Text style={styles.previewText}>Preview</Text>
        <GlowingBorder boxStyle={GLOW_BORDER_STYLE} color={currentColor} />
        <UserSongCover songImg={img} imgStyle={GLOW_BORDER_STYLE} />
      </View>
      <View style={styles.wheel}>
        <ColorPicker
          color={currentColor}
          onColorChange={handleColorChange}
          useNativeDriver={true}
          useNativeLayout={false}
          thumbSize={15}
          sliderHidden={true}
          swatches={false}
        />
      </View>
      <View style={styles.applyButtonContainer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  wheel: {
    flex: 0.5,
  },
  preview: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  previewText: {
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    top: 30,
  },
  applyButtonContainer: { flex: 0.5 },
  applyButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: 100,
    height: 50,
    padding: 10,
    borderRadius: 5,
    marginTop: 50,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
