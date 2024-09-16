import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearTokens } from "../../utils/tokenActions";
import { reduxLogout } from "../../store/userReducer";
import { clearPosts } from "../../store/postReducer";
import { useContext } from "react";
import { UpdateContext } from "../../context/loading";

export default Notify = () => {
  const dispatch = useDispatch();
  const { shouldFetch, setShouldFetch } = useContext(UpdateContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.testingBox}
        onPress={async () => {
          await clearTokens();
          dispatch(reduxLogout());
          dispatch(clearPosts());
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
