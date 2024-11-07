import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";

const ApplyButton = ({ handleApplyChanges }) => {
  return (
    <TouchableOpacity onPress={handleApplyChanges} style={styles.applyButton}>
      <Text style={styles.applyButtonText}>Apply Changes</Text>
      <Icon name="checkmark" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default ApplyButton;

const styles = StyleSheet.create({
  applyButton: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    marginBottom: 100,
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 8,
    width: 180,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
