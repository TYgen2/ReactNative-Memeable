import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";

const ViewSavedButton = ({ navigation, colors }) => {
  const handlePressed = () => {
    navigation.navigate("SavedPost", { colors });
  };

  return (
    <TouchableOpacity
      onPress={handlePressed}
      style={[styles.container, { backgroundColor: colors.secondary }]}
    >
      <Icon name="bookmark-outline" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};

export default ViewSavedButton;

const styles = StyleSheet.create({
  container: {
    marginLeft: "auto",
    marginRight: 20,
    padding: 10,
    borderRadius: 25,
  },
});
