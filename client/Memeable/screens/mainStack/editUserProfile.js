import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import {
  selectImageForBgImage,
  selectImageForProfile,
} from "../../utils/helper";
import Icon from "react-native-vector-icons/Ionicons";

export default EditUserProfile = ({ route, navigation }) => {
  const { icon, bgColor, bgImage, data } = route.params;

  const {
    username,
    setUsername,
    displayName,
    setdisplayName,
    customIcon,
    setCustomIcon,
    prevIcon,
    userBio,
    setUserBio,
    newBgImage,
    setNewBgImage,
    prevBgImage,
    updateInfo,
    isUpdating,
  } = useUpdateProfile(data, icon, bgImage);

  // check whether icon and bgImage is updated by user (not yet save)
  // if yes, display the new chosen image. If no, use the old one
  const iconSource = customIcon ? { uri: customIcon } : prevIcon;
  const bgImageSource = newBgImage ? { uri: newBgImage } : prevBgImage;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => selectImageForBgImage(setNewBgImage)}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View style={[styles.editLogo, { padding: 10 }]}>
          <Icon name="create-outline" size={40} color="rgba(255,255,255,0.9)" />
        </View>
        <ImageBackground
          source={bgImageSource}
          style={styles.backgroundImage}
        />
      </TouchableOpacity>
      <View style={styles.iconBorder}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => selectImageForProfile(setCustomIcon)}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <View style={[styles.editLogo, { padding: 8 }]}>
            <Icon
              name="create-outline"
              size={30}
              color="rgba(255,255,255,0.9)"
            />
          </View>
          <Image
            source={iconSource}
            style={[styles.icon, { backgroundColor: bgColor }]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.editInput}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            updateInfo();
            if (customIcon) {
            }
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>SAVE</Text>
        </TouchableOpacity>
        <View
          style={[styles.textInput, { height: 60, justifyContent: "center" }]}
        >
          <Text style={{ color: "grey" }}>User name</Text>
          <TextInput value={username} onChangeText={setUsername} />
        </View>
        <View
          style={[styles.textInput, { height: 60, justifyContent: "center" }]}
        >
          <Text style={{ color: "grey" }}>Display name</Text>
          <TextInput value={displayName} onChangeText={setdisplayName} />
        </View>
        <View style={[styles.textInput, { height: 120, paddingTop: 4 }]}>
          <Text style={{ color: "grey" }}>Personal bio</Text>
          <TextInput value={userBio} onChangeText={setUserBio} />
        </View>
      </View>
      <View style={styles.songContainer}></View>
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
  },
  editLogo: {
    zIndex: 1,
    borderRadius: 30,
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.2)",
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
});
