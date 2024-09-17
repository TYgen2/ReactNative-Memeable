import {
  Alert,
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
import { googleLoginConfig, screenWidth } from "../../utils/constants";
import { loginReviewSchema } from "../../utils/validationSchema";
import { useDispatch, useSelector } from "react-redux";
import { facebookLogin, googleLogin, userLogin } from "../../handleAPIs/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { reduxSetUserInfo } from "../../store/userReducer";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { handleLoginFetch } from "../../utils/helper";
import { getTokens } from "../../utils/tokenActions";
import { fetchUserInfo } from "../../store/userActions";

WebBrowser.maybeCompleteAuthSession();

export default Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const handleLogin = async (method, payload) => {
    let res;
    switch (method) {
      case "Local":
        res = await userLogin(payload);
        break;
      case "Google":
        res = await googleLogin(payload);
        break;
      case "Facebook":
        res = await facebookLogin(payload);
        break;
      default:
        return;
    }

    if (!res.success) {
      Alert.alert(`${method} login failed: `, res.message);
      return;
    }
    console.log(`Logged in with ${method} method!`);

    if (res.isNew) {
      navigation.replace("Edit Profile", { userId: res.userId });
      return;
    }

    // User exist, proceed to fetch user info before login
    dispatch(fetchUserInfo());
  };

  const [request, response, promptAsync] =
    Google.useAuthRequest(googleLoginConfig);

  useEffect(() => {
    // handle google login
    if (response?.type == "success") {
      const { authentication } = response;
      const idToken = authentication?.idToken;

      handleLogin("Google", idToken);
    }
  }, [response]);

  const handleFacebook = async () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      (res) => {
        if (res.grantedPermissions) {
          AccessToken.getCurrentAccessToken().then((data) => {
            handleLogin("Facebook", data.accessToken);
          });
        } else {
          console.log("Facebook login failed WTF???");
        }
      }
    );
  };

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
              <Text style={{ fontWeight: "bold", color: "white" }}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <View style={styles.helperContainer}>
        {/* helper */}
        <Text>Don't have an account yet?</Text>
        <Pressable onPress={() => navigation.push("Register")}>
          <Text
            style={{
              fontWeight: "bold",
              color: "#4682B4",
              textAlign: "center",
            }}
          >
            Register now 😎
          </Text>
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
            style={styles.methodIcon}
            onPress={() => handleFacebook()}
          >
            <Image
              source={require("../../assets/facebook.png")}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.methodIcon}
            onPress={() => promptAsync()}
          >
            <Image
              source={require("../../assets/google.png")}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 50,
    elevation: 6,
    marginHorizontal: 10,
  },
});
