import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default UserProfileEmpty = ({ isPostsLoading, colors }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {isPostsLoading ? (
        <ActivityIndicator
          size={30}
          style={[styles.loading, { backgroundColor: colors.primary }]}
          color="grey"
        />
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
    paddingBottom: 100,
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    color: "grey",
    paddingBottom: 100,
  },
});
