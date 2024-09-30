import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getBgImageSource,
  getIconSource,
  selectImageForBgImage,
  selectImageForProfile,
  selectSongForProfile,
} from "../../utils/helper";
import Icon from "react-native-vector-icons/Ionicons";
import { useEditUserProfileViewModel } from "../../hooks/editUserProfile/useEditUserProfileViewModel";
import { ActivityIndicator } from "react-native";
import GlowingBorder from "../../components/glowingBorder";
import UserSongCover from "../../components/userProfile/userSongCover";

const GLOW_BORDER_STYLE = {
  width: 150,
  height: 150,
  marginRight: 20,
  marginTop: 20,
  position: "absolute",
  right: 0,
  top: 0,
};

export default EditUserProfile = ({ route, navigation }) => {
  const { data } = route.params;
  const {
    newBgImage,
    setNewBgImage,
    newIcon,
    setNewIcon,
    displayName,
    setDisplayName,
    username,
    setUsername,
    userBio,
    setUserBio,
    newSong,
    setNewSong,
    newCover,
    setNewCover,
    newColor,
    setNewColor,
    handleUpdateProfile,
    isUpdating,
  } = useEditUserProfileViewModel(data);

  const handleSave = async () => {
    const success = await handleUpdateProfile();
    if (success) {
      navigation.pop();
    } else {
      console.log("Some updates failed");
    }
  };

  return (
    <View style={styles.container}>
      {isUpdating && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => selectImageForBgImage(setNewBgImage)}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Icon
          name="create-outline"
          size={40}
          color="white"
          style={{ position: "absolute", zIndex: 1 }}
        />
        <ImageBackground
          source={getBgImageSource(newBgImage)}
          style={styles.backgroundImage}
        />
      </TouchableOpacity>
      <View style={styles.iconBorder}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => selectImageForProfile(setNewIcon, true)}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Icon
            name="create-outline"
            size={30}
            color="white"
            style={{ position: "absolute", zIndex: 1 }}
          />
          <Image
            source={getIconSource(newIcon)}
            style={[styles.icon, { backgroundColor: newIcon.bgColor }]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.editInput}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={{ color: "white", fontWeight: "bold" }}>SAVE</Text>
        </TouchableOpacity>
        <View
          style={[styles.textInput, { height: 60, justifyContent: "center" }]}
        >
          <Text style={{ color: "grey" }}>User name</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>
        <View
          style={[styles.textInput, { height: 60, justifyContent: "center" }]}
        >
          <Text style={{ color: "grey" }}>Display name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="none"
          />
        </View>
        <View style={[styles.textInput, { height: 120, paddingTop: 4 }]}>
          <Text style={{ color: "grey" }}>Personal bio</Text>
          <TextInput
            value={userBio}
            onChangeText={setUserBio}
            autoCapitalize="none"
          />
        </View>
      </View>
      <View style={styles.songContainer}>
        <Text style={styles.profileBGM}>🎵Profile BGM🎵</Text>
        <View style={styles.configContainer}>
          <View style={styles.configArea}>
            <TouchableOpacity
              style={styles.configButton}
              activeOpacity={0.7}
              onPress={async () => selectSongForProfile(setNewSong)}
            >
              <Text style={styles.configText}>
                {newSong.name !== undefined
                  ? newSong.name
                  : "Song - select from device"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.configButton}
              activeOpacity={0.7}
              onPress={() => selectImageForProfile(setNewCover, false)}
            >
              <Text style={styles.configText}>Cover - select from device</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.configButton}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("EditBorderColor", {
                  img: newCover,
                  borderColor: newColor,
                  onColorChange: (color) => setNewColor(color),
                })
              }
            >
              <Text style={styles.configText}>Change border color</Text>
            </TouchableOpacity>
          </View>
          <GlowingBorder boxStyle={GLOW_BORDER_STYLE} color={newColor} />
          <UserSongCover songImg={newCover} imgStyle={GLOW_BORDER_STYLE} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backgroundImage: {
    height: 250,
    width: "100%",
    backgroundColor: "black",
    opacity: 0.7,
  },
  iconBorder: {
    height: 100,
    width: 100,
    borderRadius: 100,
    shadowColor: "transparent",
    top: 200,
    left: 10,
    position: "absolute",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 1,
  },
  icon: {
    width: 90,
    height: 90,
    borderRadius: 90,
    backgroundColor: "black",
    opacity: 0.7,
  },
  editInput: {
    flex: 3,
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    paddingRight: "5%",
  },
  saveButton: {
    backgroundColor: "black",
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "grey",
    width: "95%",
    borderRadius: 10,
    paddingLeft: 10,
  },
  songContainer: {
    flex: 2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    elevation: 2,
  },
  profileBGM: {
    paddingTop: 4,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  configContainer: { flex: 1, flexDirection: "row" },
  configArea: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 200,
  },
  configButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 40,
    borderRadius: 10,
    backgroundColor: "black",
    borderWidth: 1,
  },
  configText: {
    color: "white",
    fontWeight: "bold",
  },
});
