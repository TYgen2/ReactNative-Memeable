import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const HomeEmpty = () => {
  return (
    <View style={styles.emptyComponent}>
      <>
        <Image
          source={require("../../assets/empty_icon/sushang.png")}
          style={styles.icon}
        />
        <Text style={styles.emptyPost}>No post yet...Zzz</Text>
      </>
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
  emptyPost: { fontWeight: "bold", fontSize: 30, color: "grey" },
});
