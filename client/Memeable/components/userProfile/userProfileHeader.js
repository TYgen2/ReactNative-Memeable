import { StyleSheet, View } from "react-native";
import { memo } from "react";
import Banner from "./headerComponents/Banner";
import ProfileIcon from "./headerComponents/ProfileIcon";
import BasicInfo from "./headerComponents/BasicInfo";
import MoreInfo from "./headerComponents/MoreInfo";
import ButtonActions from "./headerComponents/ButtonActions";

export default UserProfileHeader = memo(
  ({ userData, isStack, isMe, handlePressedFollow }) => {
    return (
      <>
        <Banner isStack={isStack} userData={userData} />
        <View style={styles.userInfo}>
          <ProfileIcon userData={userData} />
          <BasicInfo userData={userData} />
          <MoreInfo userData={userData} />
          <ButtonActions
            userData={userData}
            isMe={isMe}
            handlePressedFollow={handlePressedFollow}
          />
        </View>
      </>
    );
  }
);

const styles = StyleSheet.create({
  userInfo: {
    height: 300,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
