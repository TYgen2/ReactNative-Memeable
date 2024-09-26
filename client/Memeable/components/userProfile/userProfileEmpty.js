import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default UserProfileEmpty = ({ isPostsLoading }) => {
  return (
    <View style={styles.container}>
      {isPostsLoading ? (
        <ActivityIndicator size={30} style={styles.loading} color="grey" />
      ) : (
        <Text style={styles.text}>This user has no posts</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 100,
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    color: "grey",
    paddingBottom: 100,
  },
});
