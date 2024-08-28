import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { reduxLogout } from "../store/userReducer";
import { clearToken } from "../store/tokenReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default Home = () => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          height: 100,
          width: 100,
          backgroundColor: "pink",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={async () => {
          await AsyncStorage.removeItem("jwt");
          dispatch(reduxLogout());
          dispatch(clearToken());
        }}
      >
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
  },
});
