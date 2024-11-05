import { StyleSheet, View } from "react-native";
import { useProfileUpdates } from "../../context/ProfileUpdateContext";
import useColorTheme from "../../hooks/useColorTheme";
import EditBanner from "../../components/editProfile/EditBanner";
import EditProfileIcon from "../../components/editProfile/EditProfileIcon";
import EditBasicInfo from "../../components/editProfile/EditBasicInfo";
import SaveButton from "../../components/editProfile/SaveButton";
import EditProfileBGM from "../../components/editProfile/EditProfileBGM";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default EditUserProfile = ({ route }) => {
  const { colors } = useColorTheme();

  const { userDetails } = useSelector((state) => state.user);
  const { isUpdating, handleSave } = useProfileUpdates();

  const [previewGradient, setPreviewGradient] = useState(
    userDetails.gradientConfig
  );

  const [previewCover, setPreviewCover] = useState(userDetails.song.imageUri);
  const [previewSong, setPreviewSong] = useState(userDetails.song);

  useEffect(() => {
    if (route.params?.updatedPreview) {
      if (route.params.updatedPreview.gradient) {
        setPreviewGradient(route.params.updatedPreview.gradient);
      }
      if (route.params.updatedPreview.cover) {
        setPreviewCover(route.params.updatedPreview.cover);
      }
      if (route.params.updatedPreview.song) {
        console.log("Updated song!!");
        setPreviewSong(route.params.updatedPreview.song);
      }
    }
  }, [route.params?.updatedPreview]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {isUpdating && <LoadingOverlay />}
      <EditBanner bgImageSource={userDetails.bgImage} />
      <EditProfileIcon userIcon={userDetails.userIcon} />
      <SaveButton handleSave={handleSave} />
      <EditBasicInfo
        displayName={userDetails.displayName}
        username={userDetails.username}
        userBio={userDetails.userBio}
      />
      <EditProfileBGM
        gradientData={previewGradient}
        imageUri={previewCover}
        songData={previewSong}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
