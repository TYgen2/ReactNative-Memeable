import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";

const AppIcon = () => {
  return (
    <View style={styles.appIcon}>
      <ImageBackground
        source={require("../../../assets/popcat.png")}
        style={styles.popcat}
        resizeMode="contain"
      />

      {/* title */}
      <Text style={styles.title}>MEMEABLE</Text>
    </View>
  );
};

export default AppIcon;

const styles = StyleSheet.create({
  appIcon: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  popcat: {
    height: 200,
    width: 200,
  },
  title: {
    fontSize: 40,
    fontWeight: "400",
    letterSpacing: 4,
  },
});
