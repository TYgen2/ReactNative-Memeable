import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { screenWidth } from "../utils/constants";

const GapLine = () => {
  return (
    <View style={styles.gapContainer}>
      <View
        style={[
          styles.gapline,
          { marginLeft: screenWidth * 0.1, marginRight: 10 },
        ]}
      />
      <Text>OR</Text>
      <View
        style={[
          styles.gapline,
          { marginRight: screenWidth * 0.1, marginLeft: 10 },
        ]}
      />
    </View>
  );
};

export default GapLine;

const styles = StyleSheet.create({
  gapContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  gapline: {
    flex: 1,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
});
