import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import useUpdateIcon from "../../hooks/updateUserProfile/useUpdateIcon";
import { useProfileUpdates } from "../../context/ProfileUpdateContext";
import FastImage from "react-native-fast-image";
import { getIconSource, selectImageForProfile } from "../../utils/helper";
import useColorTheme from "../../hooks/useColorTheme";
import Icon from "react-native-vector-icons/Ionicons";

const EditProfileIcon = ({ userIcon }) => {
  const { colors } = useColorTheme();

  const { newIcon, setNewIcon, updateIconInfo } = useUpdateIcon(userIcon);
  const { registerUpdate, unregisterUpdate } = useProfileUpdates();

  useEffect(() => {
    registerUpdate("icon", updateIconInfo);
    return () => unregisterUpdate("icon");
  }, [updateIconInfo]);

  return (
    <View style={[styles.iconBorder, { backgroundColor: colors.primary }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => selectImageForProfile(setNewIcon, true)}
        style={styles.container}
      >
        <Icon
          name="create-outline"
          size={30}
          color="white"
          style={styles.editIcon}
        />
        <FastImage
          source={getIconSource(newIcon)}
          style={[styles.icon, { backgroundColor: newIcon.bgColor }]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileIcon;

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
  iconBorder: {
    height: 100,
    width: 100,
    borderRadius: 100,
    shadowColor: "transparent",
    top: 200,
    left: 10,
    position: "absolute",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 1,
  },
  editIcon: { position: "absolute", zIndex: 1 },
  icon: {
    width: 90,
    height: 90,
    borderRadius: 90,
    backgroundColor: "black",
    opacity: 0.7,
  },
});
