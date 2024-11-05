import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import useColorTheme from "../../hooks/useColorTheme";
import GlowingBorder from "../../components/GlowingBorder";
import { useUpdateGradient } from "../../hooks/updateUserProfile/useUpdateGradient";
import GradientColorPicker from "../../components/editProfile/config/GradientColorPicker";
import GradientSlider from "../../components/editProfile/config/GradientSlider";
import { useProfileUpdates } from "../../context/ProfileUpdateContext";
import useUpdateCover from "../../hooks/updateUserProfile/useUpdateCover";
import { selectImageForProfile } from "../../utils/helper";

const EditSongCover = ({ route, navigation }) => {
  const { gradient, image } = route.params;
  const { colors } = useColorTheme();

  const {
    sliderValue,
    setSliderValue,
    startColor,
    setStartColor,
    endColor,
    setEndColor,
    gradientConfig,
    updateGradientInfo,
  } = useUpdateGradient(gradient);

  const { newCover, setNewCover, updateCoverInfo } = useUpdateCover(image);

  const { registerUpdate } = useProfileUpdates();

  useEffect(() => {
    registerUpdate("gradient", updateGradientInfo);
    registerUpdate("cover", updateCoverInfo);
  }, [updateGradientInfo, updateCoverInfo]);

  const handleApplyChanges = () => {
    const updatedPreview = {
      gradient: gradientConfig,
      cover: newCover,
    };

    navigation.navigate("EditUserProfile", {
      updatedPreview,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.previewContainer}>
        <GlowingBorder
          gradientConfig={gradientConfig}
          width={250}
          height={250}
        />
        <TouchableOpacity
          style={styles.configCover}
          onPress={() => selectImageForProfile(setNewCover, false)}
        >
          <UserSongCover songImg={newCover} width={245} height={245} />
        </TouchableOpacity>
      </View>

      <View style={styles.colorPickerContainer}>
        <GradientColorPicker
          label="1st Color"
          color={startColor}
          onColorChange={setStartColor}
        />
        <GradientColorPicker
          label="2nd Color"
          color={endColor}
          onColorChange={setEndColor}
        />
      </View>

      <View style={styles.flex1Container}>
        <GradientSlider value={sliderValue} onValueChange={setSliderValue} />
      </View>

      <View style={styles.flex1Container}>
        <TouchableOpacity
          onPress={handleApplyChanges}
          style={styles.applyButton}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditSongCover;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  configCover: {
    position: "absolute",
    width: 245,
    height: 245,
    opacity: 0.8,
  },
  previewContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  flex1Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colorPickerContainer: {
    flex: 1.5,
    flexDirection: "row",
    paddingHorizontal: 60,
    paddingTop: 30,
  },
  applyText: { color: "white", fontSize: 20, fontWeight: "bold" },
  applyButton: {
    width: 100,
    height: 50,
    borderRadius: 10,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
