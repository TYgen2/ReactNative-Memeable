import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import Icon from "react-native-vector-icons/Ionicons";

const CommentButton = ({ count, openCommentModal, colors }) => {
  return (
    <View style={styles.center}>
      <Text style={[styles.commentCount, { color: colors.text }]}>{count}</Text>
      <TouchableOpacity onPress={openCommentModal}>
        <Icon
          name="chatbox-ellipses-outline"
          size={32}
          color={colors.inactiveIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(CommentButton);

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  commentCount: {
    fontSize: 14,
    paddingBottom: 2,
  },
});
