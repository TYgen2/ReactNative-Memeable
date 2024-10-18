import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../BackButton";
import { getBgImageSource, getIconSource } from "../../utils/helper";
import FastImage from "react-native-fast-image";
import GlowingBorder from "../GlowingBorder";
import UserSongCover from "./UserSongCover";
import useColorTheme from "../../hooks/useColorTheme";

const GLOW_BORDER_STYLE = {
  width: 100,
  height: 100,
  marginRight: 20,
  marginTop: 20,
  position: "absolute",
  right: 0,
  top: 0,
};

export default UserProfileHeader = ({
  userData,
  isStack,
  isMe,
  navigation,
  handlePressed,
}) => {
  const { colors } = useColorTheme();

  return (
    <>
      {isStack && <BackButton navigation={navigation} />}
      <ImageBackground
        source={getBgImageSource(userData.bgImageSource)}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.userInfo}>
        {/* If user have set their profile bgm, show it */}
        {userData.song.songUri && (
          <>
            <GlowingBorder
              boxStyle={GLOW_BORDER_STYLE}
              color={userData.song.borderColor}
            />
            <UserSongCover
              songImg={userData.song.imageUri}
              imgStyle={GLOW_BORDER_STYLE}
            />
          </>
        )}

        <View style={[styles.iconBorder, { backgroundColor: colors.primary }]}>
          <FastImage
            style={[
              styles.icon,
              { backgroundColor: userData.userIcon.bgColor },
            ]}
            source={getIconSource(userData.userIcon)}
          />
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={[styles.displayName, { color: colors.text }]}>
            {userData.displayName}
          </Text>
          <Text style={[styles.username, { color: colors.text }]}>
            @{userData.username}
          </Text>
          <Text style={[styles.userBio, , { color: colors.text }]}>
            {userData.userBio}
          </Text>
        </View>
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
            <Text style={[styles.infoText, { color: colors.text }]}>
              Followers
            </Text>
            <Text style={[styles.infoNumber, { color: colors.text }]}>
              {userData.followersCount}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={[styles.infoText, { color: colors.text }]}>
              Following
            </Text>
            <Text style={[styles.infoNumber, { color: colors.text }]}>
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
            <Text style={[styles.infoText, { color: colors.text }]}>Posts</Text>
            <Text style={[styles.infoNumber, { color: colors.text }]}>
              {userData.postsCount}
            </Text>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            activeOpacity={0.8}
            onPress={async () => {
              if (isMe) {
                navigation.navigate("SettingStack", {
                  screen: "EditUserProfile",
                  params: { data: userData },
                });
              } else {
                handlePressed();
              }
            }}
          >
            <Text style={[styles.actionText, { color: colors.invertedText }]}>
              {isMe
                ? "Edit profile"
                : userData.isFollowing
                ? "Unfollow"
                : "Follow"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            activeOpacity={0.8}
            onPress={() => {
              if (isMe) {
                navigation.navigate("SettingStack", {
                  screen: "AppSetting",
                });
              }
            }}
          >
            <Text style={[styles.actionText, { color: colors.invertedText }]}>
              {isMe ? "Setting" : "Message"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    height: 250,
    width: "100%",
  },
  userInfo: {
    height: 300,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  iconBorder: {
    height: 120,
    width: 120,
    borderRadius: 120,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  icon: {
    height: 110,
    width: 110,
    borderRadius: 110,
  },
  userInfoContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginHorizontal: 15,
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
    alignSelf: "center",
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
