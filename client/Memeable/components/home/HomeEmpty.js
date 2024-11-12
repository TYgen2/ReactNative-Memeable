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
        <>
          <Image
            source={require("../../assets/empty_icon/sushang.png")}
            style={styles.icon}
          />
          <Text style={styles.emptyPost}>No post yet...Zzz</Text>
        </>
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
  icon: {
    width: 100,
    height: 100,
    opacity: 0.4,
  },
  loadingIcon: {
    width: 150,
    height: 150,
  },
  emptyPost: { fontWeight: "bold", fontSize: 30, color: "grey" },
});
