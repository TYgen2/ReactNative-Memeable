import React, { useEffect } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { getBgImageSource, selectImageForBgImage } from "../../utils/helper";
import { useProfileUpdates } from "../../context/ProfileUpdateContext";
import Icon from "react-native-vector-icons/Ionicons";
import useUpdateBgImage from "../../hooks/updateUserProfile/useUpdateBgImage";

const EditBanner = ({ bgImageSource }) => {
  const { newBgImage, setNewBgImage, updateBgImageInfo } =
    useUpdateBgImage(bgImageSource);

  const { registerUpdate, unregisterUpdate } = useProfileUpdates();

  useEffect(() => {
    registerUpdate("banner", updateBgImageInfo);
    return () => unregisterUpdate("banner");
  }, [updateBgImageInfo]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => selectImageForBgImage(setNewBgImage)}
      style={styles.container}
    >
      <Icon
        name="create-outline"
        size={40}
        color="white"
        style={styles.editIcon}
      />
      <ImageBackground
        source={getBgImageSource(newBgImage)}
        style={styles.backgroundImage}
      />
    </TouchableOpacity>
  );
};

export default EditBanner;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: { position: "absolute", zIndex: 1 },
  backgroundImage: {
    height: 250,
    width: "100%",
    backgroundColor: "black",
    opacity: 0.7,
  },
});
