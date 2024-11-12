import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { barOffset } from "../../../utils/constants";

const HeaderIcon = () => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Creating new account</Text>

      {/* thinking icon */}
      <ImageBackground
        source={require("../../../assets/thinking.png")}
        style={styles.thinking}
        resizeMode="contain"
      />
    </View>
  );
};

export default HeaderIcon;

const styles = StyleSheet.create({
  titleContainer: {
    flex: 2.5,
    marginTop: barOffset,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  thinking: {
    width: 200,
    height: 200,
  },
});
