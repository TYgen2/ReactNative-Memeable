import { useEffect, useState } from "react";
import {
  Animated,
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
import { hideGIF, showGIF } from "../../utils/animation";
import { handleLoginFetch, selectImageForProfile } from "../../utils/helper";
import { reduxSetUserInfo } from "../../store/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { handleIconUpload } from "../../handleAPIs/userActions";
import { getTokens } from "../../utils/tokenActions";
import { fetchUserInfo } from "../../store/userActions";

export default EditProfile = ({ route }) => {
  const { userId } = route.params;
  const [icon, setIcon] = useState(DEFAULT_ICONS[0]);
  const [customIcon, setCustomIcon] = useState(null);
  const [bgColor, setBgColor] = useState("white");
  const [gif] = useState(new Animated.Value(0));

  const dispatch = useDispatch();

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
          <Image
            source={item.source}
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };
  // Flatlist render item (BGColor)
  const renderBGcolor = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          borderRadius: 30,
          margin: 5,
          backgroundColor: item,
        }}
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

  useEffect(() => {
    if (icon != DEFAULT_ICONS[1].source || customIcon) {
      hideGIF(gif);
    }
  }, [icon, customIcon]);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={{ fontWeight: "bold", fontSize: 28 }}>
          Profile picture 😎
        </Text>
      </View>
      <EffectiveGIF gif={gif} />
      <View style={styles.iconContainer}>
        <View style={styles.iconBorder}>
          <View style={styles.iconInsideBorder}>
            {customIcon ? (
              <Image
                source={{ uri: customIcon }}
                style={{
                  width: 260,
                  height: 260,
                  borderRadius: 260,
                  resizeMode: "cover",
                }}
              />
            ) : (
              <Image
                source={icon.source}
                style={{
                  width: 260,
                  height: 260,
                  borderRadius: 260,
                  resizeMode: "cover",
                  backgroundColor: bgColor,
                }}
              />
            )}
          </View>
        </View>
      </View>

      {/* some default icons */}
      <View style={styles.optionContainer}>
        <Text style={{ fontWeight: "bold", fontSize: 20, paddingBottom: 10 }}>
          Default meme icons
        </Text>
        <FlatList
          data={DEFAULT_ICONS}
          renderItem={renderIcons}
          horizontal={true}
        />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            paddingBottom: 10,
            color: customIcon ? "grey" : "black",
          }}
        >
          Icon background colors
        </Text>
        <FlatList
          data={ICON_BGCOLOR}
          renderItem={renderBGcolor}
          numColumns={5}
          contentContainerStyle={{
            backgroundColor: "rgba(0,0,0, 0.1)",
            padding: 10,
            borderRadius: 10,
            opacity: customIcon ? 0.3 : 1,
          }}
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
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            Select from album
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={async () => {
            const tokens = await getTokens();
            const iconJSON = {
              id: icon.id,
              bgColor,
              customIcon,
            };
            await handleIconUpload(
              userId,
              iconJSON,
              tokens.jwtToken,
              tokens.refreshToken
            );

            dispatch(
              fetchUserInfo({
                jwtToken: tokens.jwtToken,
                refreshToken: tokens.refreshToken,
              })
            );
          }}
        >
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
});
