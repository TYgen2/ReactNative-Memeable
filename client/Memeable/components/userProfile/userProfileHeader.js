import { StyleSheet, View } from "react-native";
import { memo } from "react";
import Banner from "./headerComponents/Banner";
import ProfileIcon from "./headerComponents/ProfileIcon";
import BasicInfo from "./headerComponents/BasicInfo";
import MoreInfo from "./headerComponents/MoreInfo";
import ButtonActions from "./headerComponents/ButtonActions";
import AudioPlayer from "./headerComponents/AudioPlayer";

const UserProfileHeader = ({
  userData,
  isStack,
  isMe,
  handlePressedFollow,
}) => {
  const hasBGM = userData.song.songUri ? true : false;

  return (
    <>
      <Banner isStack={isStack} userData={userData} />
      <View style={styles.userInfoContainer}>
        <ProfileIcon userData={userData} />
        <BasicInfo userData={userData} />
        <MoreInfo userData={userData} />
        <ButtonActions
          userData={userData}
          isMe={isMe}
          handlePressedFollow={handlePressedFollow}
        />
        {hasBGM && <AudioPlayer userData={userData} />}
      </View>
    </>
  );
};

export default memo(UserProfileHeader);

const styles = StyleSheet.create({
  userInfoContainer: {
    height: 300,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    position: "relative",
  },
});
