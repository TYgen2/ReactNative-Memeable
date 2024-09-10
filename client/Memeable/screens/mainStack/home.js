import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { barOffset, screenWidth } from "../../utils/constants";
import MainPost from "../../components/mainPost";
import { useSelector } from "react-redux";
import useFetchPosts from "../../hooks/useFetchPosts";
import { UpdateContext } from "../../context/loading";
import { useContext, useEffect } from "react";

export default Home = ({ navigation }) => {
  const { userInfo } = useSelector((state) => state.user);
  const { shouldFetch, setShouldFetch } = useContext(UpdateContext);
  const userId = userInfo ? userInfo.userId : null;

  const { posts, isLoading, fetchPosts, loadMorePosts } = useFetchPosts(
    userId,
    "main"
  );

  const renderPost = ({ item }) => {
    return (
      <MainPost item={item} userId={userInfo.userId} navigation={navigation} />
    );
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchPosts(1);
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  return (
    <View style={styles.container}>
      <View style={styles.appName}>
        <Image
          source={require("../../assets/popcat.png")}
          style={{ width: 25, height: 25 }}
        />
        <Text style={styles.title}>Memeable</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={posts}
          refreshing={isLoading}
          renderItem={renderPost}
          onRefresh={fetchPosts}
          onEndReached={loadMorePosts}
          overScrollMode="never"
          contentContainerStyle={{
            flexGrow: 1,
            width: screenWidth,
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: 100,
              }}
            >
              {isLoading ? (
                <Image
                  source={require("../../assets/kurukuru.gif")}
                  style={{
                    width: 150,
                    height: 150,
                  }}
                />
              ) : (
                <Text
                  style={{ fontWeight: "bold", fontSize: 30, color: "grey" }}
                >
                  Zzz...
                </Text>
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
  appName: {
    flex: 1,
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
  content: {
    flex: 11,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
