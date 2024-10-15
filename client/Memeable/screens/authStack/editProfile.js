import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  DEFAULT_ICONS,
  ICON_BGCOLOR,
  screenWidth,
} from "../../utils/constants";
import EffectiveGIF from "../../components/effectiveGIF";
import { selectImageForProfile } from "../../utils/helper";
import useEditProfile from "../../hooks/auth/useEditProfile";

const EditProfile = () => {
  const {
    icon,
    bgColor,
    customIcon,
    gif,
    isLoading,
    setCustomIcon,
    setIcon,
    setBgColor,
    handleContinue,
  } = useEditProfile();

  // Flatlist render item (Icons)
  const renderIcons = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.defaultIconBorder}
        onPress={() => {
          setIcon(item);
          if (customIcon) {
            setCustomIcon(null);
          }
        }}
      >
        <View style={styles.defaultIconInnerBorder}>
          <Image source={item.source} style={styles.defaultIconOption} />
        </View>
      </TouchableOpacity>
    );
  };
  // Flatlist render item (BGColor)
  const renderBGcolor = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.bgColorOption, { backgroundColor: item }]}
        disabled={customIcon ? true : false}
        onPress={() => {
          setBgColor(item);
          if (icon == DEFAULT_ICONS[1] && !customIcon) {
            showGIF(gif);
          }
        }}
      ></TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Profile picture 😎</Text>
      </View>
      <EffectiveGIF gif={gif} />
      <View style={styles.iconContainer}>
        <View style={styles.iconBorder}>
          <View style={styles.iconInsideBorder}>
            {customIcon ? (
              <Image source={{ uri: customIcon }} style={styles.customIcon} />
            ) : (
              <Image
                source={icon.source}
                style={[styles.defaultIcon, { backgroundColor: bgColor }]}
              />
            )}
          </View>
        </View>
      </View>

      {/* some default icons */}
      <View style={styles.optionContainer}>
        <Text style={styles.subTitleText}>Default meme icons</Text>
        <FlatList
          data={DEFAULT_ICONS}
          renderItem={renderIcons}
          horizontal={true}
        />
        <Text
          style={[
            styles.subTitleText,
            { color: customIcon ? "grey" : "black" },
          ]}
        >
          Icon background colors
        </Text>
        <FlatList
          data={ICON_BGCOLOR}
          renderItem={renderBGcolor}
          numColumns={5}
          contentContainerStyle={[
            styles.flatList,
            { opacity: customIcon ? 0.3 : 1 },
          ]}
        />
        <View style={styles.gapContainer}>
          <View
            style={[
              styles.gapline,
              { marginLeft: screenWidth * 0.1, marginRight: 10 },
            ]}
          />
          <Text>OR</Text>
          <View
            style={[
              styles.gapline,
              { marginRight: screenWidth * 0.1, marginLeft: 10 },
            ]}
          />
        </View>
      </View>
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => {
            selectImageForProfile(setCustomIcon);
          }}
        >
          <Text style={styles.buttonText}>Select from album</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleContinue}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  titleText: { fontWeight: "bold", fontSize: 28 },
  gif: {
    position: "absolute",
    zIndex: 1,
    right: 10,
    top: 80,
  },
  iconContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  iconBorder: {
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: "black",
  },
  iconInsideBorder: {
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 280,
    backgroundColor: "white",
  },
  optionContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  subTitleText: { fontWeight: "bold", fontSize: 20, paddingBottom: 10 },
  defaultIcon: {
    width: 260,
    height: 260,
    borderRadius: 260,
    resizeMode: "cover",
  },
  defaultIconOption: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  defaultIconBorder: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginHorizontal: 4,
    backgroundColor: "black",
  },
  defaultIconInnerBorder: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 45,
  },
  gapContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  gapline: {
    flex: 1,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    width: screenWidth * 0.8,
    borderRadius: 10,
    marginBottom: 10,
  },
  submitContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bgColorOption: {
    width: 30,
    height: 30,
    borderRadius: 30,
    margin: 5,
  },
  customIcon: {
    width: 260,
    height: 260,
    borderRadius: 260,
    resizeMode: "cover",
  },
  buttonText: { color: "white", fontSize: 24, fontWeight: "bold" },
  flatList: {
    backgroundColor: "rgba(0,0,0, 0.1)",
    padding: 10,
    borderRadius: 10,
  },
});
