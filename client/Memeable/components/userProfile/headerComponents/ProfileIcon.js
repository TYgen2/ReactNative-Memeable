import { StyleSheet, View } from "react-native";
import React from "react";
import useColorTheme from "../../../hooks/useColorTheme";
import { getIconSource } from "../../../utils/helper";
import FastImage from "react-native-fast-image";

const ProfileIcon = ({ userData }) => {
  const { colors } = useColorTheme();

  const bgColor = userData?.userIcon.bgColor;
  const userIcon = userData?.userIcon;

  return (
    <View style={[styles.iconBorder, { backgroundColor: colors.primary }]}>
      <FastImage
        style={[styles.icon, { backgroundColor: bgColor }]}
        source={getIconSource(userIcon)}
      />
    </View>
  );
};

export default ProfileIcon;

const styles = StyleSheet.create({
  iconBorder: {
    height: 120,
    width: 120,
    borderRadius: 120,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  icon: {
    height: 110,
    width: 110,
    borderRadius: 110,
  },
});
