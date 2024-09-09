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
import { useEffect } from "react";
import useFetchProfileInfo from "../../hooks/useFetchProfileInfo";
import BackButton from "../../components/backButton";

export default UserProfile = ({ route, navigation }) => {
  const { userInfo } = useSelector((state) => state.user);
  const { fromHome } = route.params || {};

  const { posts, isLoading, fetchPosts, loadMorePosts } = useFetchPosts(
    userInfo.userId,
    "user"
  );

  const { userData, isInfoLoading, fetchUserAdditional } = useFetchProfileInfo(
    userInfo.userId
  );

  const renderPost = ({ item }) => {
    return <UserPost item={item} />;
  };

  useEffect(() => {
    fetchUserAdditional();
    fetchPosts(1);
  }, []);

  const username = userInfo ? userInfo.displayName : "";
  const iconSource = userInfo
    ? userInfo?.userIcon?.customIcon
      ? { uri: userInfo.userIcon.customIcon }
      : DEFAULT_ICONS.find((icon) => icon.id === userInfo.userIcon.id)
          ?.source || DEFAULT_ICONS[0].source
    : DEFAULT_ICONS[0].source;

  if (isInfoLoading) {
    return (
      <ActivityIndicator
        size={30}
        style={{ flex: 1, backgroundColor: "white" }}
        color="grey"
      />
    );
  } else {
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
        ListHeaderComponent={
          <>
            {fromHome && <BackButton navigation={navigation} />}
            <ImageBackground
              source={require("../../assets/alya.jpg")}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
            <View style={styles.userInfo}>
              <View style={styles.iconBorder}>
                <Image style={styles.icon} source={iconSource} />
              </View>
              <Text style={styles.username}>{username}</Text>
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
                >
                  <Text style={styles.actionText}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionText}>WTF</Text>
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
