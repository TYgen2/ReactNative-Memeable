import { StyleSheet, Text, View } from "react-native";
import React from "react";
import useColorTheme from "../../../hooks/useColorTheme";

const BasicInfo = ({ userData }) => {
  const { colors } = useColorTheme();

  const displayName = userData?.displayName;
  const userName = userData?.username;
  const userBio = userData?.userBio;

  return (
    <View style={styles.userInfoContainer}>
      <Text style={[styles.displayName, { color: colors.text }]}>
        {displayName}
      </Text>
      <Text style={[styles.username, { color: colors.text }]}>@{userName}</Text>
      <Text style={[styles.userBio, , { color: colors.text }]}>{userBio}</Text>
    </View>
  );
};

export default BasicInfo;

const styles = StyleSheet.create({
  userInfoContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginHorizontal: 15,
  },
  displayName: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
  username: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
    fontStyle: "italic",
    color: "grey",
    marginBottom: 10,
  },
  userBio: {
    color: "grey",
  },
});
