import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";

const Helper = ({ navigation }) => {
  return (
    <View style={styles.helperContainer}>
      <Text>Don't have an account yet?</Text>
      <Pressable onPress={() => navigation.push("Register")}>
        <Text style={styles.registerNowText}>Register now 😎</Text>
      </Pressable>
    </View>
  );
};

export default memo(Helper);

const styles = StyleSheet.create({
  helperContainer: {
    flex: 1,
    marginTop: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  registerNowText: {
    fontWeight: "bold",
    color: "#4682B4",
    textAlign: "center",
  },
});
