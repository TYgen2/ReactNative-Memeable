import { StyleSheet, View } from "react-native";

import useRegister from "../../hooks/auth/useRegister";
import HeaderIcon from "../../components/auth/register/HeaderIcon";
import BackButton from "../../components/BackButton";
import RegisterForm from "../../components/auth/register/RegisterForm";
import DancingGIF from "../../components/auth/register/DancingGIF";

const Register = () => {
  const { isLoading, handleRegister } = useRegister();

  return (
    <View style={styles.container}>
      <BackButton buttonColor="black" />
      <HeaderIcon />
      <RegisterForm isLoading={isLoading} handleRegister={handleRegister} />
      <DancingGIF />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
