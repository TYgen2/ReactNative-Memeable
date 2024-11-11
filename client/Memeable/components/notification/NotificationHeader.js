import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React, { memo } from "react";

const NotificationHeader = ({ colors }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Icon name="notifications" size={24} color="orange" />
      <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
      <Icon name="notifications" size={24} color="orange" />
    </View>
  );
};

export default memo(NotificationHeader);

const styles = StyleSheet.create({
  container: {
    height: 60,
    gap: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
