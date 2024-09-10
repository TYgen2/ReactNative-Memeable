import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import { DEFAULT_ICONS } from "../../utils/constants";
import UserPost from "../../components/userPost";
import useFetchPosts from "../../hooks/useFetchPosts";
import { useContext, useEffect } from "react";
import useFetchProfileInfo from "../../hooks/useFetchProfileInfo";
import BackButton from "../../components/backButton";
import { UpdateContext } from "../../context/loading";
import { handleFollow } from "../../api/userActions";
import { getTokens } from "../../utils/tokenActions";

export default UserProfile = ({ route, navigation }) => {
  const { userInfo } = useSelector((state) => state.user);
  const { isStack, targetId } = route.params || {};
  const { shouldFetch, setShouldFetch } = useContext(UpdateContext);
  const isMe = userInfo.userId === targetId;

  const { posts, isLoading, fetchPosts, loadMorePosts } = useFetchPosts(
    targetId,
    "user"
  );

  const { userData, isInfoLoading, fetchUserProfile, handleFollowersCount } =
    useFetchProfileInfo(userInfo.userId, targetId);

  const renderPost = ({ item }) => {
    return <UserPost item={item} />;
  };

  useEffect(() => {
    // when visiting other users' profile,
    // won't refresh after pressed follow / unfollow
    if (!isMe) {
      fetchUserProfile();
      fetchPosts(1);
      setShouldFetch(false);
    }
  }, []);

  useEffect(() => {
    // when should refresh the userprofile:
    // 1 - After user upload a post
    // 2 - User performed follow / unfollow action
    // Note: Should not refresh when user is in other user profile
    if (isMe && (shouldFetch || isInfoLoading)) {
      fetchUserProfile();
      fetchPosts(1);
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  if (isInfoLoading) {
    return (
      <ActivityIndicator
        size={30}
        style={{ flex: 1, backgroundColor: "white" }}
        color="grey"
      />
    );
  } else {
    const iconBgColor = userData.userIcon.bgColor || "transparent";
    const iconSource = userData.userIcon.customIcon
      ? { uri: userData.userIcon.customIcon }
      : DEFAULT_ICONS.find((icon) => icon.id === userData.userIcon.id).source;

    return (
      <FlatList
        data={posts}
        renderItem={renderPost}
        numColumns={3}
        contentContainerStyle={styles.container}
        overScrollMode="never"
        onEndReached={loadMorePosts}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchPosts}
            enabled={false}
          />
        }
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 24,
                color: "grey",
                paddingBottom: 100,
              }}
            >
              This user has no posts
            </Text>
          </View>
        }
        ListHeaderComponent={
          <>
            {isStack && <BackButton navigation={navigation} />}
            <ImageBackground
              source={require("../../assets/alya.jpg")}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
            <View style={styles.userInfo}>
              <View style={styles.iconBorder}>
                <Image
                  style={[styles.icon, { backgroundColor: iconBgColor }]}
                  source={iconSource}
                />
              </View>
              <Text style={styles.username}>{userData.displayName}</Text>
              <Text style={styles.userBio}>anime lover!! follow for more</Text>
              <View style={styles.moreInfo}>
                <View
                  style={[
                    styles.infoBox,
                    {
                      borderRightWidth: 0.5,
                      borderRightColor: "rgba(0,0,0,0.1)",
                    },
                  ]}
                >
                  <Text style={styles.infoText}>Followers</Text>
                  <Text style={styles.infoNumber}>
                    {userData.followersCount}
                  </Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>Following</Text>
                  <Text style={styles.infoNumber}>
                    {userData.followingCount}
                  </Text>
                </View>
                <View
                  style={[
                    styles.infoBox,
                    {
                      borderLeftWidth: 0.5,
                      borderLeftColor: "rgba(0,0,0,0.1)",
                    },
                  ]}
                >
                  <Text style={styles.infoText}>Posts</Text>
                  <Text style={styles.infoNumber}>{userData.postsCount}</Text>
                </View>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.8}
                  onPress={async () => {
                    if (isMe) {
                      console.log("meeeeeee");
                    } else {
                      // handle follow or unfollow
                      const tokens = await getTokens();
                      await handleFollow(
                        userInfo.userId,
                        targetId,
                        userData.isFollowing ? "unfollow" : "follow",
                        tokens.jwtToken,
                        tokens.refreshToken
                      ).then(() => {
                        handleFollowersCount(
                          userData.isFollowing ? "unfollow" : "follow"
                        );
                      });
                    }
                  }}
                >
                  <Text style={styles.actionText}>
                    {isMe
                      ? "Edit profile"
                      : userData.isFollowing
                      ? "Unfollow"
                      : "Follow"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionText}>
                    {isMe ? "Setting" : "Message"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  backgroundImage: {
    height: 250,
    width: "100%",
  },
  userInfo: {
    height: 250,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBorder: {
    height: 120,
    width: 120,
    borderRadius: 120,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    height: 110,
    width: 110,
    borderRadius: 110,
  },
  username: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
  userBio: {
    color: "grey",
  },
  moreInfo: {
    marginHorizontal: 40,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  infoText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  infoNumber: {
    fontWeight: "bold",
    fontSize: 20,
  },
  actionContainer: {
    width: "60%",
    flexDirection: "row",
    marginBottom: 80,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2B2B2B",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
    zIndex: 5,
    shadowColor: "blue",
  },
  actionText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
});
