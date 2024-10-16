import { Formik } from "formik";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { barOffset, screenWidth } from "../../utils/constants";
import { registerReviewSchema } from "../../utils/validationSchema";
import FastImage from "react-native-fast-image";
import useRegister from "../../hooks/auth/useRegister";

export default Register = ({ navigation }) => {
  const { isLoading, handleRegister } = useRegister();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.pop()}
      >
        <Icon name="keyboard-backspace" size={30} />
      </TouchableOpacity>
      {/* title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MEMEABLE</Text>
        <Text style={styles.subTitle}>Creating new account</Text>
      </View>
      {/* thinking icon */}
      <View style={styles.appIcon}>
        <ImageBackground
          source={require("../../assets/thinking.png")}
          style={styles.thinking}
          resizeMode="contain"
        />
      </View>

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
            <View style={styles.inputRow}>
              {/* displayName input */}
              <Icon name="email" size={24} />
              <TextInput
                autoCapitalize={false}
                autoCorrect={false}
                style={styles.input}
                placeholder="Display name (4-32 characters)"
                onChangeText={props.handleChange("displayName")}
                value={props.values.displayName}
              />
            </View>
            <Text style={styles.errorMsg}>
              {props.touched.displayName && props.errors.displayName}
            </Text>
            <View style={styles.inputRow}>
              {/* email input */}
              <Icon name="email" size={24} />
              <TextInput
                autoCapitalize={false}
                autoCorrect={false}
                style={styles.input}
                placeholder="Email"
                onChangeText={props.handleChange("email")}
                value={props.values.email}
              />
            </View>
            <Text style={styles.errorMsg}>
              {props.touched.email && props.errors.email}
            </Text>
            <View style={styles.inputRow}>
              {/* password input */}
              <Icon name="key" size={24} />
              <TextInput
                style={styles.input}
                placeholder="Password (6-32 characters)"
                onChangeText={props.handleChange("password")}
                value={props.values.password}
                maxLength={32}
                secureTextEntry={true}
              />
            </View>
            <Text style={styles.errorMsg}>
              {props.touched.password && props.errors.password}
            </Text>
            <View style={styles.inputRow}>
              {/* password confirm input */}
              <Icon name="key" size={24} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                onChangeText={props.handleChange("passwordConfirmation")}
                value={props.values.passwordConfirmation}
                maxLength={32}
                secureTextEntry={true}
              />
            </View>
            <Text style={styles.errorMsg}>
              {props.touched.passwordConfirmation &&
                props.errors.passwordConfirmation}
            </Text>
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
      <View style={styles.gif}>
        <Text style={styles.omg}>OhmyGotto{"\n"}it's new user!</Text>
        <FastImage
          source={require("../../assets/dance1.gif")}
          style={styles.danceGIF1}
        />
        <FastImage
          source={require("../../assets/dance2.gif")}
          style={styles.danceGIF2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 1,
  },
  backButton: {
    width: 60,
    height: 60,
    position: "absolute",
    borderRadius: 30,
    top: barOffset,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1.5,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "400",
    letterSpacing: 4,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "300",
  },
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
  omg: {
    position: "absolute",
    marginTop: 30,
    paddingLeft: 100,
    fontWeight: "bold",
    color: "#F89880",
    fontStyle: "italic",
    transform: [{ rotate: "-10deg" }],
  },
  gif: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  appIcon: {
    flex: 1.5,
    justifyContent: "center",
  },
  thinking: {
    width: 160,
    height: 160,
  },
  signUpText: { fontWeight: "bold", color: "white" },
  danceGIF1: {
    flex: 1,
    width: 235,
    height: 235,
  },
  danceGIF2: {
    flex: 1,
    width: 250,
    height: 250,
  },
});
