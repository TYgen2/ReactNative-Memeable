import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo } from "react";
import { Formik } from "formik";
import { loginReviewSchema } from "../../../utils/validationSchema";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { screenWidth } from "../../../utils/constants";

const LoginForm = ({ handleLogin, isLoading }) => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginReviewSchema}
      onSubmit={(values) => {
        const handleJSON = {
          email: values.email,
          password: values.password,
        };
        handleLogin("Local", handleJSON);
      }}
    >
      {(props) => (
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            {/* email input */}
            <Icon name="email" size={24} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={props.handleChange("email")}
              value={props.values.email}
            />
          </View>
          <Text style={{ color: "red" }}>
            {props.touched.email && props.errors.email}
          </Text>
          <View style={styles.inputRow}>
            {/* password input */}
            <Icon name="key" size={24} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={props.handleChange("password")}
              value={props.values.password}
              maxLength={32}
              secureTextEntry={true}
            />
          </View>
          <Text style={{ color: "red" }}>
            {props.touched.password && props.errors.password}
          </Text>
          {/* login button */}
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.6}
            onPress={props.handleSubmit}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.loginText}>LOGIN</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default memo(LoginForm);

const styles = StyleSheet.create({
  inputContainer: {
    flex: 3,
    justifyContent: "space-evenly",
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
  loginButton: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth * 0.8,
    height: 50,
    borderRadius: 10,
    backgroundColor: "black",
  },
  loginText: { fontWeight: "bold", color: "white" },
});
