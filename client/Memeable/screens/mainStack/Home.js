import { FlatList, StyleSheet, View } from "react-native";
import { barOffset, screenWidth } from "../../utils/constants";
import MainPost from "../../components/post/MainPost";
import { useSelector } from "react-redux";
import useFetchPosts from "../../hooks/fetchData/useFetchPosts";
import { useCallback } from "react";
import useColorTheme from "../../hooks/useColorTheme";
import HomeHeader from "../../components/home/HomeHeader";
import HomeEmpty from "../../components/home/HomeEmpty";

const Home = ({ navigation }) => {
  const { colors } = useColorTheme();
  const { allPosts } = useSelector((state) => state.post);
  const interactions = useSelector((state) => state.interaction.interactions);

  const { isLoading, loadMorePosts, refreshPosts } = useFetchPosts();

  const renderPost = useCallback(
    ({ item }) => {
      // Get interaction state for this post
      const postInteraction = interactions[item._id];

      return (
        <MainPost
          item={item}
          navigation={navigation}
          colors={colors}
          key={`${item._id}-${postInteraction?.isSaved}-${postInteraction?.hasLiked}`}
        />
      );
    },
    [navigation, colors, interactions]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <HomeHeader colors={colors} navigation={navigation} />
      <FlatList
        data={allPosts}
        refreshing={isLoading}
        renderItem={renderPost}
        onRefresh={refreshPosts}
        // prevent called when initial fetching
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd <= 0) return;
          loadMorePosts();
        }}
        onEndReachedThreshold={0.9}
        overScrollMode="never"
        contentContainerStyle={styles.flatlistContainer}
        ListEmptyComponent={<HomeEmpty isLoading={isLoading} />}
      />
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: barOffset,
  },
  flatlistContainer: {
    flexGrow: 1,
    width: screenWidth,
    paddingBottom: 70,
  },
});
