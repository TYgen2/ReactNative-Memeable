import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const DancingGIF = () => {
  return (
    <View style={styles.gif}>
      <Text style={styles.omg}>OhmyGotto{"\n"}it's new user!</Text>
      <Image
        source={require("../../../assets/dance1.gif")}
        style={styles.danceGIF1}
      />
      <Image
        source={require("../../../assets/dance2.gif")}
        style={styles.danceGIF2}
      />
    </View>
  );
};

export default DancingGIF;

const styles = StyleSheet.create({
  omg: {
    position: "absolute",
    marginTop: 30,
    paddingLeft: 100,
    fontWeight: "bold",
    color: "#F89880",
    fontStyle: "italic",
    transform: [{ rotate: "-10deg" }],
  },
  gif: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  danceGIF1: {
    flex: 1,
    width: 235,
    height: 235,
  },
  danceGIF2: {
    flex: 1,
    width: 250,
    height: 250,
  },
});
