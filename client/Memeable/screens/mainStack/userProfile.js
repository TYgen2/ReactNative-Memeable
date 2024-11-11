import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import UserPostGrid from "../../components/post/UserPostGrid";
import { useCallback, useRef } from "react";
import useFetchProfileInfo from "../../hooks/fetchData/useFetchProfileInfo";
import useFetchPostsForUser from "../../hooks/fetchData/useFetchPostsForUser";
import { useFocusEffect } from "@react-navigation/native";
import { UserProfileModel } from "../../models/UserProfileModel";
import UserProfileHeader from "../../components/userProfile/UserProfileHeader";
import UserProfileEmpty from "../../components/userProfile/UserProfileEmpty";
import useColorTheme from "../../hooks/useColorTheme";
import { LOADING_INDICATOR } from "../../utils/constants";

const UserProfile = ({ route, navigation }) => {
  const { colors } = useColorTheme();

  const { userDetails, status } = useSelector((state) => state.user);
  const { isStack, targetId } = route.params || {};
  const prevUserDetailsRef = useRef(userDetails);

  const { userData, setUserData, isMe, isInfoLoading, handlePressedFollow } =
    useFetchProfileInfo(userDetails?.userId, targetId);

  const { userPosts, isPostsLoading, loadMorePosts, refreshPosts } =
    useFetchPostsForUser(targetId);

  const renderPost = useCallback(
    ({ item }) => {
      return <UserPostGrid item={item} navigation={navigation} />;
    },
    [navigation]
  );

  // handle instant UI reflect (follower, following)
  useFocusEffect(
    useCallback(() => {
      if (isMe && prevUserDetailsRef.current !== userDetails) {
        setUserData(new UserProfileModel(userDetails));
        prevUserDetailsRef.current = userDetails;
      }
    }, [userDetails])
  );

  // handle first mount by local loading state
  if (isInfoLoading || status === "loading") {
    return <LOADING_INDICATOR bgColor={colors.primary} />;
  }

  if (!userData) {
    return (
      <View style={styles.userNotFound}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userPosts}
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
      ListEmptyComponent={
        <UserProfileEmpty isPostsLoading={isPostsLoading} colors={colors} />
      }
      ListHeaderComponent={
        <UserProfileHeader
          userData={userData}
          isStack={isStack}
          isMe={isMe}
          handlePressedFollow={handlePressedFollow}
        />
      }
    />
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  userNotFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loading: { flex: 1 },
});
