import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import useColorTheme from "../../../hooks/useColorTheme";
import { useNavigation } from "@react-navigation/native";

const ButtonActions = ({ userData, isMe, handlePressedFollow }) => {
  const { colors } = useColorTheme();
  const navigation = useNavigation();

  const leftActionText = isMe
    ? "Edit profile"
    : userData?.isFollowing
    ? "Unfollow"
    : "Follow";
  const rightActionText = isMe ? "Setting" : "Message";

  const handleLeftAction = async () => {
    if (isMe) {
      navigation.navigate("SettingStack", {
        screen: "EditUserProfile",
      });
    } else {
      handlePressedFollow();
    }
  };

  const handleRightAction = () => {
    if (isMe) {
      navigation.navigate("SettingStack", {
        screen: "AppSetting",
      });
    }
  };

  return (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.secondary }]}
        activeOpacity={0.8}
        onPress={handleLeftAction}
      >
        <Text style={[styles.actionText, { color: colors.invertedText }]}>
          {leftActionText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.secondary }]}
        activeOpacity={0.8}
        onPress={handleRightAction}
      >
        <Text style={[styles.actionText, { color: colors.invertedText }]}>
          {rightActionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonActions;

const styles = StyleSheet.create({
  actionContainer: {
    width: "60%",
    flexDirection: "row",
    marginBottom: 80,
    gap: 10,
    alignSelf: "center",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#2B2B2B",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
    zIndex: 5,
    shadowColor: "blue",
  },
  actionText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
});
