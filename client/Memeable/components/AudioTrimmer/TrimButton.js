import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";

const TrimButton = ({ handleTrim, isLoading, isTrimmed }) => {
  return (
    <>
      <TouchableOpacity
        onPress={handleTrim}
        style={[styles.trimButton, isLoading && styles.trimButtonDisabled]}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Icon name="cut" size={20} color="white" />
        <Text style={styles.trimButtonText}>
          {isLoading ? "Trimming..." : "Trim"}
        </Text>
      </TouchableOpacity>
      {isTrimmed && (
        <Text style={styles.trimSuccessText}>Trimmed successfully</Text>
      )}
    </>
  );
};

export default TrimButton;

const styles = StyleSheet.create({
  trimButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 100,
    marginBottom: 10,
  },
  trimButtonDisabled: {
    backgroundColor: "#99CCFF",
  },
  trimButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  trimSuccessText: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },
});
