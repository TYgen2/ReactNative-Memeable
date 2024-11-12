import { Image, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import EffectiveGIF from "../../EffectiveGIF";

const ProfileIcon = ({ gif, customIcon, icon, bgColor }) => {
  return (
    <>
      <View style={styles.title}>
        <Text style={styles.titleText}>Profile picture 😎</Text>
      </View>
      <EffectiveGIF gif={gif} />
      <View style={styles.iconContainer}>
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
    </>
  );
};

export default memo(ProfileIcon);

const styles = StyleSheet.create({
  title: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  titleText: { fontWeight: "bold", fontSize: 28 },
  gif: {
    position: "absolute",
    zIndex: 1,
    right: 10,
    top: 80,
  },
  iconContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
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
