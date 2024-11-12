import { StyleSheet, View } from "react-native";
import useLogin from "../../hooks/auth/useLogin";
import AppIcon from "../../components/auth/login/AppIcon";
import LoginForm from "../../components/auth/login/LoginForm";
import Helper from "../../components/auth/login/Helper";
import OtherMethods from "../../components/auth/login/OtherMethods";
import OrGapLine from "../../constants/OrGapLine";

const Login = ({ navigation }) => {
  const { isLoading, handleLogin, promptAsync, handleFacebook } = useLogin();

  return (
    <View style={styles.container}>
      <AppIcon />
      <LoginForm handleLogin={handleLogin} isLoading={isLoading} />
      <Helper navigation={navigation} />
      <OrGapLine />
      <OtherMethods handleFacebook={handleFacebook} promptAsync={promptAsync} />
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
});
