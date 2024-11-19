import { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { popInAnimations, popOutAnimations } from "../../utils/animation";
import OutsidePressHandler from "react-native-outside-press";
import { selectImageForUpload } from "../../utils/helper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import useColorTheme from "../../hooks/useColorTheme";

const PostButton = () => {
  const { colors } = useColorTheme();

  const [icon_bottom] = useState(new Animated.Value(40));
  const [icon_opacity] = useState(new Animated.Value(0));
  const [icon_folder] = useState(new Animated.Value(170));
  const [icon_camera] = useState(new Animated.Value(170));

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      popOut();
    }
  }, [isFocused]);

  const [pop, setPop] = useState(false);
  const popIn = () => {
    setPop(true);
    popInAnimations(icon_bottom, icon_opacity, icon_folder, icon_camera);
  };
  const popOut = () => {
    setPop(false);
    popOutAnimations(icon_bottom, icon_opacity, icon_folder, icon_camera);
  };

  return (
    <OutsidePressHandler
      onOutsidePress={() => {
        pop === true ? popOut() : null;
      }}
      style={styles.postButtonContainer}
    >
      <Animated.View
        style={[
          styles.subButton,
          {
            bottom: icon_bottom,
            right: icon_folder,
            opacity: icon_opacity,
            backgroundColor: colors.tertiary,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FunctionStack", {
              screen: "Camera",
            })
          }
        >
          <IonIcon name="camera" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>
      {/* Select from album */}
      <Animated.View
        style={[
          styles.subButton,
          {
            bottom: icon_bottom,
            left: icon_camera,
            opacity: icon_opacity,
            backgroundColor: colors.tertiary,
          },
        ]}
      >
        <TouchableOpacity onPress={() => selectImageForUpload(navigation)}>
          <IonIcon name="folder-open-outline" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>
      <View style={[styles.buttonBorder, { backgroundColor: "white" }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tabBar }]}
          activeOpacity={0.7}
          onPress={() => {
            pop === false ? popIn() : popOut();
          }}
        >
          <IonIcon name="add-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </OutsidePressHandler>
  );
};

export default PostButton;

const styles = StyleSheet.create({
  postButtonContainer: {
    flex: 1,
    elevation: 5,
    zIndex: 5,
    shadowColor: "transparent",
  },
  buttonBorder: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 40,
    height: 40,
    borderRadius: 40,
    bottom: 55,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: "#2b2b2b",
  },
  subButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#5D3FD3",
  },
});
