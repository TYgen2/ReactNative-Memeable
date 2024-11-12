import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo } from "react";
import { screenWidth } from "../../../utils/constants";

const ActionButtons = ({
  selectImageForProfile,
  setCustomIcon,
  handleContinue,
  isLoading,
}) => {
  return (
    <View style={styles.submitContainer}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => {
          selectImageForProfile(setCustomIcon);
        }}
      >
        <Text style={styles.buttonText}>Select from album</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={handleContinue}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default memo(ActionButtons);

const styles = StyleSheet.create({
  submitContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: screenWidth * 0.8,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: { color: "white", fontSize: 24, fontWeight: "bold" },
});
