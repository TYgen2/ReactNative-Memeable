import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { reduxLogout } from "../store/features/user/userSlice";
import { clearPosts } from "../store/features/post/postSlice";
import { userLogout } from "../handleAPIs/auth";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const asyncAlert = () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "YES", onPress: () => resolve("YES") },
          { text: "NO", onPress: () => resolve("NO") },
        ],
        { cancelable: true }
      );
    });
  };

  const handleLogout = async () => {
    try {
      const userResponse = await asyncAlert();

      if (userResponse === "YES") {
        await userLogout();
        dispatch(reduxLogout());
        dispatch(clearPosts());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.button}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
