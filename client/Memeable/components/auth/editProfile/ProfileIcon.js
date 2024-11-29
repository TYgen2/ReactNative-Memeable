import { Image, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import EffectiveGIF from "../../EffectiveGIF";
import { barOffset } from "../../../utils/constants";

const ProfileIcon = ({ gif, customIcon, icon, bgColor }) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Profile picture 😎</Text>

      {/* GIF */}
      <EffectiveGIF gif={gif} />

      {/* Icon */}
      <View style={styles.iconBorder}>
        <View style={styles.iconInsideBorder}>
          {customIcon ? (
            <Image source={{ uri: customIcon }} style={styles.profileIcon} />
          ) : (
            <Image
              source={icon.source}
              style={[styles.profileIcon, { backgroundColor: bgColor }]}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(ProfileIcon);

const styles = StyleSheet.create({
  container: {
    flex: 3,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: barOffset,
  },
  title: { fontWeight: "bold", fontSize: 28 },
  iconBorder: {
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "black",
  },
  iconInsideBorder: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 280,
    backgroundColor: "white",
  },
  profileIcon: {
    width: 260,
    height: 260,
    borderRadius: 260,
    resizeMode: "cover",
  },
});
