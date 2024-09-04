import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { reduxLogout } from "../../store/userReducer";
import { clearTokens } from "../../utils/helper";

export default Home = ({ navigation }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.testingBox}
        onPress={async () => {
          await clearTokens();
          dispatch(reduxLogout());
        }}
      >
        <Text>LOGOUT</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.testingBox, { backgroundColor: "green" }]}
        onPress={() => {
          navigation.push("ViewPost");
        }}
      >
        <Text>Go inside post</Text>
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
  testingBox: {
    height: 100,
    width: 100,
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
  },
});
