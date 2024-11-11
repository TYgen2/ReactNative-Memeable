import { StyleSheet, Text, View, Image } from "react-native";
import React, { memo } from "react";

const HomeHeader = ({ colors }) => {
  return (
    <View
      style={[styles.appName, { borderBottomColor: colors.titleBottomBar }]}
    >
      <Image
        source={require("../../assets/popcat.png")}
        style={styles.titleIcon}
      />
      <Text style={[styles.title, { color: colors.text }]}>Memeable</Text>
    </View>
  );
};

export default memo(HomeHeader);

const styles = StyleSheet.create({
  appName: {
    height: 60,
    width: "100%",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    borderBottomWidth: 0.3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    paddingLeft: 6,
  },
  titleIcon: { width: 25, height: 25 },
});
