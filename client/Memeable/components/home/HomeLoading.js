import { Image, StyleSheet, View } from "react-native";
import React from "react";

const HomeLoading = ({ colors }) => {
  return (
    <View
      style={[styles.loadingContainer, { backgroundColor: colors.primary }]}
    >
      <Image
        source={require("../../assets/kurukuru.gif")}
        style={styles.loadingIcon}
      />
    </View>
  );
};

export default HomeLoading;

const styles = StyleSheet.create({
  loadingIcon: {
    width: 150,
    height: 150,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
