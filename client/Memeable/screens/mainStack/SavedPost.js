import { StyleSheet, FlatList, Image, View, Text } from "react-native";
import React, { useCallback } from "react";
import useFetchSavedPosts from "../../hooks/fetchData/useFetchSavedPosts";
import UserPostGrid from "../../components/post/UserPostGrid";
import { LOADING_INDICATOR } from "../../utils/constants";

const SavedPost = ({ navigation, route }) => {
  const { colors } = route.params;
  const { savedPosts, isPostsLoading, loadMorePosts, refreshPosts } =
    useFetchSavedPosts();

  const renderPost = useCallback(
    ({ item }) => {
      return <UserPostGrid item={item} navigation={navigation} />;
    },
    [navigation]
  );

  const SavedPostEmpty = () => {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/empty_icon/firefly.png")}
          style={styles.icon}
        />
        <Text style={styles.emptyText}>No saved posts yet</Text>
      </View>
    );
  };

  if (isPostsLoading) return <LOADING_INDICATOR bgColor={colors.primary} />;

  return (
    <FlatList
      data={savedPosts}
      renderItem={renderPost}
      numColumns={3}
      contentContainerStyle={[
        styles.flatListcontainer,
        { backgroundColor: colors.primary },
      ]}
      overScrollMode="never"
      onEndReached={loadMorePosts}
      refreshing={isPostsLoading}
      onRefresh={refreshPosts}
      ListEmptyComponent={SavedPostEmpty}
    />
  );
};

export default SavedPost;

const styles = StyleSheet.create({
  flatListcontainer: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 100,
    height: 100,
    opacity: 0.4,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
  },
});
