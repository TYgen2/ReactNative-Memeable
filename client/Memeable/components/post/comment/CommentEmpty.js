import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LOADING_INDICATOR } from "../../../utils/constants";

const CommentEmpty = ({ isCommentLoading }) => {
  if (isCommentLoading) return <LOADING_INDICATOR />;

  return (
    <View style={styles.emptyComment}>
      <Image
        source={require("../../../assets/empty_icon/xueyi.png")}
        style={{ width: 100, height: 100, opacity: 0.4 }}
      />
      <Text style={styles.emptyText}>No comment yet...Zzz</Text>
    </View>
  );
};

export default CommentEmpty;

const styles = StyleSheet.create({
  emptyComment: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontWeight: "bold", fontSize: 24, color: "grey" },
});
