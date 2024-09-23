import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { reduxLogout } from "../../store/userReducer";
import { clearPosts } from "../../store/postReducer";
import { useContext } from "react";
import { UpdateContext } from "../../context/loading";
import { userLogout } from "../../handleAPIs/auth";

export default Notify = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await userLogout();
    dispatch(reduxLogout());
    dispatch(clearPosts());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.testingBox} onPress={handleLogout}>
        <Text>LOGOUT</Text>
      </TouchableOpacity>
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
  testingBox: {
    height: 100,
    width: 100,
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
  },
});
