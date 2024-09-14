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
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_BGIMAGE } from "../../utils/constants";
import UserPost from "../../components/userPost";
import useFetchPosts from "../../hooks/useFetchPosts";
import { useCallback, useContext, useEffect } from "react";
import useFetchProfileInfo from "../../hooks/useFetchProfileInfo";
import BackButton from "../../components/backButton";
import { UpdateContext } from "../../context/loading";
import { getTokens } from "../../utils/tokenActions";
import { getBgImageSource, getIconSource } from "../../utils/helper";
import { handleFollow } from "../../store/userActions";
import { useFocusEffect } from "@react-navigation/native";

export default UserProfile = ({ route, navigation }) => {
  const { userDetails } = useSelector((state) => state.user);
  const { isStack, targetId } = route.params || {};
  const { shouldFetch, setShouldFetch } = useContext(UpdateContext);

  const dispatch = useDispatch();

  const { userData, setUserData, isInfoLoading, handleFollowersCount, isMe } =
    useFetchProfileInfo(userDetails?.userId, targetId);

  const { posts, isLoading, fetchPosts, loadMorePosts } = useFetchPosts(
    targetId,
    "user"
  );

  const renderPost = ({ item }) => {
    return <UserPost item={item} />;
  };

  // handle instant UI reflect
  useFocusEffect(
    useCallback(() => {
      if (isMe) {
        setUserData(userDetails);
      }
    }, [userDetails])
  );

  // useEffect(() => {
  //   // when visiting other users' profile,
  //   // won't refresh after pressed follow / unfollow
  //   if (!isMe) {
  //     fetchUserProfile();
  //     fetchPosts(1);
  //     setShouldFetch(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   // when should refresh the userprofile:
  //   // 1 - After user upload a post
  //   // 2 - User performed follow / unfollow action
  //   // Note: Should not refresh when user is in other user profile
  //   if (isMe && (shouldFetch || isInfoLoading)) {
  //     fetchUserProfile();
  //     fetchPosts(1);
  //     setShouldFetch(false);
  //   }
  // }, [shouldFetch]);

  if (isInfoLoading) {
    return (
      <ActivityIndicator
        size={30}
        style={{ flex: 1, backgroundColor: "white" }}
        color="grey"
      />
    );
  } else {
    // check whether icon and bgImage is found from database
    // if not, fallback using default icon
    const iconBgColor = userData.userIcon?.bgColor || "transparent";
    const iconSource = getIconSource(userData?.userIcon);
    const bgImageSource = getBgImageSource(userData?.bgImage);

    return (
      <FlatList
        data={posts}
        renderItem={[]}
        numColumns={3}
        contentContainerStyle={styles.container}
        overScrollMode="never"
        // onEndReached={loadMorePosts}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isLoading}
        //     onRefresh={fetchPosts}
        //     enabled={false}
        //   />
        // }
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
              source={bgImageSource}
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
              <Text style={styles.displayName}>{userData.displayName}</Text>
              <Text style={styles.username}>@{userData.username}</Text>
              <Text style={styles.userBio}>{userData.userBio}</Text>
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
                      navigation.navigate("SettingStack", {
                        screen: "EditUserProfile",
                        params: {
                          icon: iconSource,
                          bgColor: iconBgColor,
                          bgImage: bgImage,
                          data: userData,
                        },
                      });
                    } else {
                      // handle follow or unfollow
                      const tokens = await getTokens();
                      // handle follow API, also update global state
                      dispatch(
                        handleFollow({
                          targetId,
                          action: userData.isFollowing ? "unfollow" : "follow",
                          jwtToken: tokens.jwtToken,
                          refreshToken: tokens.refreshToken,
                        })
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
    height: 300,
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
  displayName: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
  username: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
    fontStyle: "italic",
    color: "grey",
    marginBottom: 10,
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
