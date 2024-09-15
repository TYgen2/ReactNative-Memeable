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
} from "../../utils/helper";
import Icon from "react-native-vector-icons/Ionicons";
import useUpdateStrings from "../../hooks/updateUserProfile/useUpdateStrings";
import useUpdateBgImage from "../../hooks/updateUserProfile/useUpdateBgImage";
import useUpdateIcon from "../../hooks/updateUserProfile/useUpdateIcon";

export default EditUserProfile = ({ route, navigation }) => {
  const { data } = route.params;

  // handling udpate bgImage
  const { newBgImage, setNewBgImage, updateBgImageInfo } = useUpdateBgImage(
    data.bgImage
  );

  // handling udpate icon
  const { newIcon, setNewIcon, updateIconInfo } = useUpdateIcon(data.userIcon);

  // handling udpate of displayName, username and userBio
  const {
    displayName,
    setdisplayName,
    username,
    setUsername,
    userBio,
    setUserBio,
    updateStringInfo,
  } = useUpdateStrings({
    displayName: data.displayName,
    username: data.displayName,
    userBio: data.userBio,
  });

  return (
    <View style={styles.container}>
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
        <TouchableOpacity
          style={styles.saveButton}
          onPress={async () => {
            try {
              await Promise.all([
                updateStringInfo(),
                updateBgImageInfo(),
                updateIconInfo(),
              ]);
              navigation.pop();
            } catch (error) {
              console.log(error);
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
});
