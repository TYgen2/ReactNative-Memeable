import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { barOffset, screenWidth } from "../../utils/constants";
import MainPost from "../../components/mainPost";
import { useSelector } from "react-redux";
import useFetchPosts from "../../hooks/useFetchPosts";
import { useCallback, useEffect } from "react";

export default Home = ({ navigation }) => {
  const { allPosts } = useSelector((state) => state.post);
  const { userDetails } = useSelector((state) => state.user);

  const { isLoading, fetchPosts, loadMorePosts, refreshPosts } =
    useFetchPosts();

  const renderPost = useCallback(
    ({ item }) => {
      return <MainPost item={item} navigation={navigation} />;
    },
    [navigation]
  );

  // when home page first mount, fetch posts for page 1
  useEffect(() => {
    if (allPosts.length === 0) {
      fetchPosts(1);
    }

    // when user followed other users, clear the allPosts
    // and then trigger the fetchAllPosts above to get
    // the fresh feeds. When user unfollowed other users,
    // remove that user's posts in allPosts without refresh

    // when user post a new post, refresh the whole allPosts
    // to get the fresh feeds with updated timeAgo
  }, [userDetails.followingCount, userDetails.postsCount]);

  return (
    <View style={styles.container}>
      <View style={styles.appName}>
        <Image
          source={require("../../assets/popcat.png")}
          style={styles.titleIcon}
        />
        <Text style={styles.title}>Memeable</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={allPosts}
          refreshing={isLoading}
          renderItem={renderPost}
          onRefresh={refreshPosts}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.8}
          overScrollMode="never"
          contentContainerStyle={styles.flatlistContainer}
          ListEmptyComponent={
            <View style={styles.emptyComponent}>
              {isLoading ? (
                <Image
                  source={require("../../assets/kurukuru.gif")}
                  style={styles.loadingIcon}
                />
              ) : (
                <Text style={styles.emptyPost}>Zzz...</Text>
              )}
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: barOffset,
    backgroundColor: "white",
  },
  flatlistContainer: {
    flexGrow: 1,
    width: screenWidth,
    paddingBottom: 70,
  },
  emptyComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  appName: {
    height: 50,
    width: "100%",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    borderBottomWidth: 0.3,
    borderBottomColor: "rgba(0,0,0,0.3)",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    paddingLeft: 4,
  },
  titleIcon: { width: 25, height: 25 },
  loadingIcon: {
    width: 150,
    height: 150,
  },
  content: {
    flex: 15,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyPost: { fontWeight: "bold", fontSize: 30, color: "grey" },
});
