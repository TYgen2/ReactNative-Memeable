import { ImageBackground, StyleSheet } from "react-native";
import React from "react";
import { getBgImageSource } from "../../../utils/helper";
import BackButton from "../../BackButton";

const Banner = ({ isStack, userData }) => {
  const bgImageSource = userData?.bgImageSource;

  return (
    <>
      {isStack && <BackButton />}
      <ImageBackground
        source={getBgImageSource(bgImageSource)}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
    </>
  );
};

export default Banner;

const styles = StyleSheet.create({
  backgroundImage: {
    height: 250,
    width: "100%",
  },
});
