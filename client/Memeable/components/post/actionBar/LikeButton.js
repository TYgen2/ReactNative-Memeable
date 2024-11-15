import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import { displayLikes } from "../../../utils/helper";
import Icon from "react-native-vector-icons/Ionicons";

const LikeButton = ({ likes, isLiked, toggleLike, colors }) => {
  return (
    <View style={styles.center}>
      <Text style={{ color: colors.text }}>{displayLikes(likes)}</Text>
      <TouchableOpacity onPress={toggleLike}>
        <Icon
          name={isLiked ? "heart" : "heart-outline"}
          size={32}
          color={isLiked ? "#FF4433" : colors.inactiveIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(LikeButton);

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
