import { useEffect, useState } from "react";
import { Animated } from "react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { popInAnimations, popOutAnimations } from "../utils/animation";
import OutsidePressHandler from "react-native-outside-press";
import { selectImageForUpload } from "../utils/helper";
import { useIsFocused, useNavigation } from "@react-navigation/native";

export default PostButton = () => {
  const [icon_bottom] = useState(new Animated.Value(70));
  const [icon_opacity] = useState(new Animated.Value(0));
  const [icon_folder] = useState(new Animated.Value(170));
  const [icon_camera] = useState(new Animated.Value(170));

  const [imageUri, setImageUri] = useState(null);

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
      style={{
        flex: 1,
        elevation: 5,
        zIndex: 5,
        shadowColor: "transparent",
      }}
    >
      <Animated.View
        style={[
          styles.subButton,
          { bottom: icon_bottom, right: icon_folder, opacity: icon_opacity },
        ]}
      >
        <TouchableOpacity>
          <IonIcon name="camera" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>
      {/* Select from album */}
      <Animated.View
        style={[
          styles.subButton,
          { bottom: icon_bottom, left: icon_camera, opacity: icon_opacity },
        ]}
      >
        <TouchableOpacity
          onPress={() => selectImageForUpload(setImageUri, navigation)}
        >
          <IonIcon name="folder-open-outline" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={[styles.button, { bottom: 120 }]}
        activeOpacity={0.7}
        onPress={() => {
          pop === false ? popIn() : popOut();
        }}
      >
        <IonIcon name="add-outline" size={40} color="white" />
      </TouchableOpacity>
    </OutsidePressHandler>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: "black",
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
