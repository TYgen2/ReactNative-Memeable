import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { memo } from "react";
import { Formik } from "formik";
import { registerReviewSchema } from "../../../utils/validationSchema";
import { screenWidth } from "../../../utils/constants";
import { REGISTER_FIELDS } from "../../../constants/formFields";
import FormInput from "./FormInput";

const RegisterForm = ({ isLoading, handleRegister }) => {
  return (
    <Formik
      initialValues={{
        displayName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      }}
      validationSchema={registerReviewSchema}
      onSubmit={(values) => {
        const handleJSON = {
          displayName: values.displayName,
          email: values.email,
          password: values.password,
          authMethod: "local",
        };
        handleRegister(handleJSON);
      }}
    >
      {(props) => (
        <View style={styles.inputContainer}>
          {Object.values(REGISTER_FIELDS).map((field) => (
            <FormInput
              key={field.name}
              icon={field.icon}
              placeholder={field.placeholder}
              value={props.values[field.name]}
              onChangeText={props.handleChange(field.name)}
              error={props.errors[field.name]}
              touched={props.touched[field.name]}
              secureTextEntry={field.secureTextEntry}
              maxLength={field.name.includes("password") ? 32 : undefined}
            />
          ))}

          {/* login button */}
          <TouchableOpacity
            style={styles.signUpButton}
            activeOpacity={0.6}
            onPress={props.handleSubmit}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.signUpText}>SIGN UP</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default memo(RegisterForm);

const styles = StyleSheet.create({
  inputContainer: {
    flex: 3,
    width: screenWidth * 0.8,
    justifyContent: "center",
  },
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
  signUpButton: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth * 0.8,
    height: 50,
    borderRadius: 10,
    backgroundColor: "black",
  },
  signUpText: { fontWeight: "bold", color: "white" },
});
