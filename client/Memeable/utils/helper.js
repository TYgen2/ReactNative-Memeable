import * as ImagePicker from "expo-image-picker";
import {
  DEFAULT_BGIMAGE,
  DEFAULT_ICONS,
  DEFAULT_SONGIMAGE,
  screenWidth,
} from "../utils/constants";
import PQueue from "p-queue/dist";
import * as DocumentPicker from "expo-document-picker";

// select image for posting
export const selectImageForUpload = async (setImageUri, navigation) => {
  const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (result.granted === true) {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      selectionLimit: 1,
      quality: 1,
    });

    if (!res.canceled) {
      const { uri } = res.assets[0];
      setImageUri(uri);
      navigation.navigate("FunctionStack", {
        screen: "Upload",
        params: { imageUri: uri },
      });
    }
  } else {
    console.log("Access denied / One time only");
  }
};

// select image for profile icon
export const selectImageForProfile = async (setCustomIcon, update = false) => {
  const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (result.granted === true) {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      selectionLimit: 1,
      quality: 1,
      aspect: [1, 1],
    });

    if (!res.canceled) {
      const { uri } = res.assets[0];

      if (update) {
        setCustomIcon((prev) => ({
          bgColor: null,
          customIcon: uri,
          id: null,
        }));
      } else {
        setCustomIcon(uri);
      }
    }
  } else {
    console.log("Access denied / One time only");
  }
};

// select image for profile bgImage
export const selectImageForBgImage = async (setBgImage) => {
  const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (result.granted === true) {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      selectionLimit: 1,
      quality: 1,
      aspect: [screenWidth, 250],
    });

    if (!res.canceled) {
      const { uri } = res.assets[0];
      setBgImage(uri);
    }
  } else {
    console.log("Access denied / One time only");
  }
};

// select song for profile song
export const selectSongForProfile = async (setNewSong) => {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
    });
    if (!res.canceled) {
      const { uri, name } = res.assets[0];
      setNewSong({ uri, name });
    }
  } catch (err) {
    console.error("Error picking audio file:", err);
  }
};

export const displayLikes = (count) => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1) + "k";
  } else {
    return (count / 1000000).toFixed(1) + "M";
  }
};

export const getIconSource = (userIcon) => {
  if (userIcon?.customIcon) {
    return { uri: userIcon.customIcon };
  }

  const defaultIcon = DEFAULT_ICONS.find((icon) => icon.id === userIcon?.id);
  return defaultIcon?.source || DEFAULT_ICONS[0].source;
};

export const getBgImageSource = (bgImage) => {
  // user has set the bgImage before (must be an image uri)
  if (bgImage !== null) {
    return { uri: bgImage };
  }

  // bgImage is null by default
  return DEFAULT_BGIMAGE;
};

export const getSongImageSource = (songImg) => {
  // user has set the bgImage before (must be an image uri)
  if (songImg !== null) {
    return { uri: songImg };
  }

  // bgImage is null by default
  return DEFAULT_SONGIMAGE;
};

export const getSquareImageHeight = () => {
  return screenWidth * (14 / 15) * 0.95;
};

export const calculatePostHeight = (imageHeight, imageWidth) => {
  const squareHeight = getSquareImageHeight();
  if (imageHeight > imageWidth) return 500;
  if (imageHeight < imageWidth) return 200;
  return squareHeight;
};

export const navigateToUserProfile = (navigation, targetId) => {
  navigation.push("UserProfile", {
    isStack: true,
    targetId,
  });
};

export const apiQueue = new PQueue({ concurrency: 1, interval: 1000 });
