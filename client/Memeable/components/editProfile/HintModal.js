import { Image, StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { hintText } from "../../constants/hintConstants";

const HintModal = ({ hintModalRef }) => {
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={hintModalRef}
      snapPoints={["65%"]}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <View style={styles.beforeContainer}>
            <Text style={styles.title}>Before</Text>
            <Image
              source={require("../../assets/hint/bgm_before.png")}
              style={styles.image}
            />
          </View>

          <View style={styles.afterContainer}>
            <Text style={styles.title}>After</Text>
            <Image
              source={require("../../assets/hint/bgm_after.png")}
              style={styles.image}
            />
          </View>
        </View>

        <Text style={styles.title}>What is a Profile BGM?</Text>

        <View style={styles.textContainer}>
          <Text style={styles.hintText}>{hintText.profileBGM}</Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default HintModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    paddingTop: 10,
  },
  beforeContainer: {
    alignItems: "center",
  },
  afterContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    height: "80%",
    width: 200,
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  hintText: {
    fontSize: 16,
  },
});
