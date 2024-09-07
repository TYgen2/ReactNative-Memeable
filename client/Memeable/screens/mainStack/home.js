import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { barOffset, screenWidth } from "../../utils/constants";
import { useCallback, useState } from "react";
import { handleFetchPosts } from "../../api/publicActions";
import UserPost from "../../components/userPost";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

export default Home = ({}) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { userInfo } = useSelector((state) => state.user);

  const fetchInitialPosts = async () => {
    setIsLoading(true);
    try {
      const { postData } = await handleFetchPosts(1, 5, userInfo.userId);
      setPosts(postData);
      setCurrentPage(1);
      setHasMore(postData.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const { postData } = await handleFetchPosts(
        currentPage + 1,
        5,
        userInfo.userId
      );
      setPosts((prev) => [...prev, ...postData]);
      setCurrentPage(currentPage + 1);
      setHasMore(postData.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPost = ({ item }) => {
    return <UserPost item={item} userId={userInfo.userId} />;
  };

  useFocusEffect(
    useCallback(() => {
      fetchInitialPosts();
    }, [])
  );

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
          onRefresh={fetchInitialPosts}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
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
