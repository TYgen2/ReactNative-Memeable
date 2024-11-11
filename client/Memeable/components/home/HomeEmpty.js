import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const HomeEmpty = ({ isLoading }) => {
  return (
    <View style={styles.emptyComponent}>
      {isLoading ? (
        <Image
          source={require("../../assets/kurukuru.gif")}
          style={styles.loadingIcon}
        />
      ) : (
        <Text style={styles.emptyPost}>Zzz...</Text>
      )}
    </View>
  );
};

export default HomeEmpty;

const styles = StyleSheet.create({
  emptyComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  loadingIcon: {
    width: 150,
    height: 150,
  },
  emptyPost: { fontWeight: "bold", fontSize: 30, color: "grey" },
});
