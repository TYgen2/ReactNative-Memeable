import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const SearchEmpty = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/empty_icon/hanya.png")}
        style={styles.icon}
      />
      <Text style={styles.noMatch}>No matched result</Text>
    </View>
  );
};

export default SearchEmpty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMatch: {
    fontWeight: "bold",
    fontSize: 24,
    color: "grey",
    marginTop: 10,
  },
  icon: {
    width: 80,
    height: 80,
    opacity: 0.4,
  },
});
