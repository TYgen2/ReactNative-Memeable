import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Formik } from "formik";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { screenWidth } from "../../utils/constants";
import { loginReviewSchema } from "../../utils/validationSchema";
import useLogin from "../../hooks/auth/useLogin";

const Login = ({ navigation }) => {
  const { isLoading, handleLogin, promptAsync, handleFacebook } = useLogin();

  return (
    <View style={styles.container}>
      <View style={styles.appIcon}>
        <ImageBackground
          source={require("../../assets/popcat.png")}
          style={styles.popcat}
          resizeMode="contain"
        />
      </View>
      {/* title */}
      <Text style={styles.title}>MEMEABLE</Text>
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
      <View style={styles.helperContainer}>
        {/* helper */}
        <Text>Don't have an account yet?</Text>
        <Pressable onPress={() => navigation.push("Register")}>
          <Text style={styles.registerNowText}>Register now 😎</Text>
        </Pressable>
      </View>
      {/* gap line */}
      <View style={styles.gapContainer}>
        <View
          style={[
            styles.gapline,
            { marginLeft: screenWidth * 0.1, marginRight: 10 },
          ]}
        />
        <Text>OR</Text>
        <View
          style={[
            styles.gapline,
            { marginRight: screenWidth * 0.1, marginLeft: 10 },
          ]}
        />
      </View>

      {/* social media login */}
      <View style={styles.socialLogin}>
        <Text style={{ marginBottom: 10 }}>
          Continue with the following methods
        </Text>
        <View style={styles.methodContainer}>
          <TouchableOpacity
            style={styles.methodIconContainer}
            onPress={() => handleFacebook()}
          >
            <Image
              source={require("../../assets/facebook.png")}
              style={styles.methodIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.methodIconContainer}
            onPress={() => promptAsync()}
          >
            <Image
              source={require("../../assets/google.png")}
              style={styles.methodIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  appIcon: {
    flex: 4,
    justifyContent: "flex-end",
  },
  popcat: {
    width: screenWidth,
    height: 200,
  },
  title: {
    flex: 1.5,
    fontSize: 40,
    fontWeight: "400",
    letterSpacing: 4,
    textAlignVertical: "center",
  },
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
  helperContainer: {
    flex: 1,
    marginTop: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  gapContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  gapline: {
    flex: 1,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  socialLogin: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  methodContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  methodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    elevation: 6,
    marginHorizontal: 10,
  },
  methodIcon: { width: 50, height: 50, borderRadius: 50 },
  registerNowText: {
    fontWeight: "bold",
    color: "#4682B4",
    textAlign: "center",
  },
  loginText: { fontWeight: "bold", color: "white" },
});
