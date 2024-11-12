import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import OrGapLine from "../../../constants/OrGapLine";

const IconOptions = ({
  DEFAULT_ICONS,
  ICON_BGCOLOR,
  renderIcons,
  renderBGcolor,
  customIcon,
}) => {
  return (
    <View style={styles.optionContainer}>
      <Text style={styles.subTitleText}>Default meme icons</Text>
      <FlatList
        data={DEFAULT_ICONS}
        renderItem={renderIcons}
        horizontal={true}
      />
      <Text
        style={[styles.subTitleText, { color: customIcon ? "grey" : "black" }]}
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
      <OrGapLine />
    </View>
  );
};

export default memo(IconOptions);

const styles = StyleSheet.create({
  optionContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  subTitleText: { fontWeight: "bold", fontSize: 20, paddingBottom: 10 },
  flatList: {
    backgroundColor: "rgba(0,0,0, 0.1)",
    padding: 10,
    borderRadius: 10,
  },
});