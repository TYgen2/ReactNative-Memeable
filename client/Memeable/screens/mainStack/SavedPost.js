import { StyleSheet, FlatList } from "react-native";
import React, { useCallback } from "react";
import useFetchSavedPosts from "../../hooks/fetchData/useFetchSavedPosts";
import UserPostGrid from "../../components/post/UserPostGrid";

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

  return (
    <FlatList
      data={savedPosts}
      renderItem={renderPost}
      numColumns={3}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.primary },
      ]}
      overScrollMode="never"
      onEndReached={loadMorePosts}
      refreshing={isPostsLoading}
      onRefresh={refreshPosts}
    />
  );
};

export default SavedPost;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 70,
  },
});
