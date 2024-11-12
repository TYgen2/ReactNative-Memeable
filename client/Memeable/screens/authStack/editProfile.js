import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { DEFAULT_ICONS, ICON_BGCOLOR } from "../../utils/constants";
import { selectImageForProfile } from "../../utils/helper";
import useEditProfile from "../../hooks/auth/useEditProfile";
import { showGIF } from "../../utils/animation";
import ProfileIcon from "../../components/auth/editProfile/ProfileIcon";
import IconOptions from "../../components/auth/editProfile/IconOptions";
import ActionButtons from "../../components/auth/editProfile/ActionButtons";
import { useCallback } from "react";

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

  // Wrap with useCallback
  const renderIcons = useCallback(
    ({ item }) => {
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
    },
    [customIcon, setIcon, setCustomIcon]
  );

  // Wrap with useCallback
  const renderBGcolor = useCallback(
    ({ item }) => {
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
    },
    [customIcon, icon, setBgColor, gif]
  );

  return (
    <View style={styles.container}>
      <ProfileIcon
        gif={gif}
        customIcon={customIcon}
        icon={icon}
        bgColor={bgColor}
      />
      <IconOptions
        DEFAULT_ICONS={DEFAULT_ICONS}
        ICON_BGCOLOR={ICON_BGCOLOR}
        renderIcons={renderIcons}
        renderBGcolor={renderBGcolor}
        customIcon={customIcon}
      />
      <ActionButtons
        selectImageForProfile={selectImageForProfile}
        setCustomIcon={setCustomIcon}
        handleContinue={handleContinue}
        isLoading={isLoading}
      />
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
  bgColorOption: {
    width: 30,
    height: 30,
    borderRadius: 30,
    margin: 5,
  },
});
