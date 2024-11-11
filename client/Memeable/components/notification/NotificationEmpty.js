import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const NotificationEmpty = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/empty_icon/ruanmei.png")}
        style={styles.icon}
      />
      <Text style={styles.emptyText}>No notifications yet</Text>
    </View>
  );
};

export default NotificationEmpty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 100,
    height: 100,
    opacity: 0.4,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
  },
});
