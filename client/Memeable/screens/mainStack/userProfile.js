import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import UserPostGrid from "../../components/post/userPostGrid";
import { useCallback, useRef } from "react";
import useFetchProfileInfo from "../../hooks/fetchData/useFetchProfileInfo";
import useFetchPostsForUser from "../../hooks/fetchData/useFetchPostsForUser";
import { useFocusEffect } from "@react-navigation/native";
import { UserProfileModel } from "../../models/UserProfileModel";
import UserProfileHeader from "../../components/userProfile/userProfileHeader";
import UserProfileEmpty from "../../components/userProfile/userProfileEmpty";
import useColorTheme from "../../hooks/useColorTheme";

export default UserProfile = ({ route, navigation }) => {
  const { colors } = useColorTheme();

  const { userDetails, status } = useSelector((state) => state.user);
  const { isStack, targetId } = route.params || {};
  const prevUserDetailsRef = useRef(userDetails);

  const { userData, setUserData, isMe, isInfoLoading, handlePressed } =
    useFetchProfileInfo(userDetails?.userId, targetId);

  const { userPosts, isPostsLoading, loadMorePosts } =
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
        console.log("UserProfile re-rendered!!");
        setUserData(new UserProfileModel(userDetails));
        prevUserDetailsRef.current = userDetails;
      }
    }, [userDetails])
  );

  // handle first mount by local loading state
  if (isInfoLoading || status === "loading") {
    return (
      <ActivityIndicator
        size={30}
        style={[styles.loading, { backgroundColor: colors.primary }]}
        color="grey"
      />
    );
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
      ListEmptyComponent={
        <UserProfileEmpty isPostsLoading={isPostsLoading} colors={colors} />
      }
      ListHeaderComponent={
        <UserProfileHeader
          userData={userData}
          isStack={isStack}
          isMe={isMe}
          navigation={navigation}
          handlePressed={handlePressed}
        />
      }
    />
  );
};

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
