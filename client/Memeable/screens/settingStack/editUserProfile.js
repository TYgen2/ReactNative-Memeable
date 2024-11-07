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
import { useCallback, useEffect, useRef, useState } from "react";
import HintModal from "../../components/editProfile/HintModal";

export default EditUserProfile = ({ route }) => {
  const { colors } = useColorTheme();

  const { userDetails } = useSelector((state) => state.user);
  const { isUpdating, handleSave } = useProfileUpdates();

  const [previewGradient, setPreviewGradient] = useState(
    userDetails.gradientConfig
  );
  const [previewCover, setPreviewCover] = useState(userDetails.song.imageUri);
  const [previewSong, setPreviewSong] = useState(userDetails.song);

  const hintModalRef = useRef(null);

  const handleHintModalPress = useCallback(() => {
    hintModalRef.current?.present();
  }, []);

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
        handleHintModalPress={handleHintModalPress}
      />
      <HintModal hintModalRef={hintModalRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
