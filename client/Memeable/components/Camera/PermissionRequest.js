import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import BackButton from "../BackButton";

const PermissionRequest = ({ requestPermission }) => {
  return (
    <View style={styles.container}>
      <BackButton buttonColor="black" />
      <Image
        source={require("../../assets/empty_icon/march7th.png")}
        style={styles.icon}
      />
      <Text style={styles.message}>
        We need your permission{"\n"}to use the camera
      </Text>

      <Pressable onPress={requestPermission} style={styles.button}>
        <Text style={styles.buttonText}>GRANT</Text>
      </Pressable>
    </View>
  );
};

export default PermissionRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 20,
  },
  icon: {
    width: 150,
    height: 150,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    width: 120,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});
