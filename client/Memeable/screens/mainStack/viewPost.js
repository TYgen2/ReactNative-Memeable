import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default ViewPost = () => {
  return (
    <View style={styles.container}>
      <Text>Single post</Text>
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
