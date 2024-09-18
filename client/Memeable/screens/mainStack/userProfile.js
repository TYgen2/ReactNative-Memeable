import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import UserPost from "../../components/userPost";
import { useCallback, useEffect, useRef } from "react";
import useFetchProfileInfo from "../../hooks/useFetchProfileInfo";
import useFetchPostsForUser from "../../hooks/useFetchPostsForUser";
import BackButton from "../../components/backButton";
import { getBgImageSource, getIconSource } from "../../utils/helper";
import { useFocusEffect } from "@react-navigation/native";

export default UserProfile = ({ route, navigation }) => {
  const { userDetails, status } = useSelector((state) => state.user);
  const { isStack, targetId } = route.params || {};
  const prevUserDetailsRef = useRef(userDetails);

  const { userData, setUserData, isMe, isInfoLoading, handlePressed } =
    useFetchProfileInfo(userDetails?.userId, targetId);

  const { userPosts, isPostsLoading, fetchPosts, loadMorePosts } =
    useFetchPostsForUser(targetId);

  const renderPost = useCallback(({ item }) => {
    return <UserPost item={item} />;
  }, []);

  useEffect(() => {
    if (userPosts.length === 0) {
      fetchPosts(1);
    }
  }, []);

  // handle instant UI reflect
  useFocusEffect(
    useCallback(() => {
      if (isMe && prevUserDetailsRef.current !== userDetails) {
        console.log("UserProfile re-rendered!!");
        setUserData(userDetails);
        prevUserDetailsRef.current = userDetails;
      }
    }, [userDetails])
  );

  // handle first mount by local loading state
  if (isInfoLoading || status === "loading") {
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
        data={userPosts}
        renderItem={renderPost}
        numColumns={3}
        contentContainerStyle={styles.container}
        overScrollMode="never"
        onEndReached={loadMorePosts}
        refreshing={isPostsLoading}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isPostsLoading ? (
              <ActivityIndicator
                size={30}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  paddingBottom: 100,
                }}
                color="grey"
              />
            ) : (
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
            )}
          </View>
        }
        // ListFooterComponent={
        //   isPostsLoading && (
        //     <View
        //       style={{
        //         flex: 1,
        //         justifyContent: "center",
        //         alignItems: "center",
        //       }}
        //     >
        //       <ActivityIndicator
        //         size={50}
        //         style={{ flex: 1, backgroundColor: "white" }}
        //         color="grey"
        //       />
        //     </View>
        //   )
        // }
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
                          bgColor: iconBgColor,
                          data: userData,
                        },
                      });
                    } else {
                      handlePressed();
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
    paddingBottom: 70,
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
