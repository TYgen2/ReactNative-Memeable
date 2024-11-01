import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const SaveButton = ({ handleSave }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.saveButton}
      onPress={() => handleSave(navigation)}
    >
      <Text style={styles.saveText}>SAVE</Text>
    </TouchableOpacity>
  );
};

export default SaveButton;

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: "black",
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 10,
    marginRight: 20,
    alignSelf: "flex-end",
  },
  saveText: { color: "white", fontWeight: "bold" },
});
