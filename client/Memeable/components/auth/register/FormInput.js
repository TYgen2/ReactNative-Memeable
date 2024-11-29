import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { screenWidth } from "../../../utils/constants";

const FormInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  error,
  touched,
  secureTextEntry,
  ...props
}) => {
  return (
    <>
      <View style={styles.inputRow}>
        <Icon name={icon} size={24} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={false}
          autoCorrect={false}
          {...props}
        />
      </View>
      <Text style={styles.errorMsg}>{touched && error}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: screenWidth * 0.8,
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    alignContent: "center",
    height: 50,
    backgroundColor: "white",
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 10,
  },
  errorMsg: {
    color: "red",
  },
});

export default FormInput;
