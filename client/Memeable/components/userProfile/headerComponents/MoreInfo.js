import { StyleSheet, Text, View } from "react-native";
import React from "react";
import useColorTheme from "../../../hooks/useColorTheme";

const MoreInfo = ({ userData }) => {
  const { colors } = useColorTheme();

  const followersCount = userData?.followersCount;
  const followingCount = userData?.followingCount;
  const postsCount = userData?.postsCount;

  return (
    <View style={styles.moreInfo}>
      <View
        style={[
          styles.infoBox,
          {
            borderRightWidth: 0.5,
            borderRightColor: "rgba(0,0,0,0.2)",
          },
        ]}
      >
        <Text style={[styles.infoText, { color: colors.text }]}>Followers</Text>
        <Text style={[styles.infoNumber, { color: colors.text }]}>
          {followersCount}
        </Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={[styles.infoText, { color: colors.text }]}>Following</Text>
        <Text style={[styles.infoNumber, { color: colors.text }]}>
          {followingCount}
        </Text>
      </View>
      <View
        style={[
          styles.infoBox,
          {
            borderLeftWidth: 0.5,
            borderLeftColor: "rgba(0,0,0,0.2)",
          },
        ]}
      >
        <Text style={[styles.infoText, { color: colors.text }]}>Posts</Text>
        <Text style={[styles.infoNumber, { color: colors.text }]}>
          {postsCount}
        </Text>
      </View>
    </View>
  );
};

export default MoreInfo;

const styles = StyleSheet.create({
  moreInfo: {
    marginHorizontal: 40,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  infoText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  infoNumber: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
