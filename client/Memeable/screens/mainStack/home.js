import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { barOffset, screenWidth } from "../../utils/constants";
import MainPost from "../../components/mainPost";
import { useSelector } from "react-redux";
import useFetchPosts from "../../hooks/useFetchPosts";
import { useCallback, useEffect } from "react";

export default Home = ({ navigation }) => {
  const { userDetails } = useSelector((state) => state.user);
  const { allPosts } = useSelector((state) => state.post);
  const userId = userDetails?.userId;

  const { isLoading, fetchAllPosts, loadMorePosts, refreshPosts } =
    useFetchPosts("main");

  const renderPost = useCallback(
    ({ item }) => {
      return <MainPost item={item} userId={userId} navigation={navigation} />;
    },
    [navigation]
  );

  useEffect(() => {
    if (allPosts.length === 0) {
      fetchAllPosts(1);
    } else {
      refreshPosts();
    }
  }, []);

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
          data={allPosts}
          refreshing={isLoading}
          renderItem={renderPost}
          onRefresh={refreshPosts}
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
