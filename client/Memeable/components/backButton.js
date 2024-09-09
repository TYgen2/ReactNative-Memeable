import { Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { barOffset } from "../utils/constants";

export default BackButton = ({ navigation }) => {
  return (
    <Pressable style={styles.backButton} onPress={() => navigation.pop()}>
      <Icon name="keyboard-backspace" size={30} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    top: barOffset,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 1,
    shadowColor: "transparent",
  },
});
