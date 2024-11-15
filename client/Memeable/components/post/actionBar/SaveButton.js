import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React, { memo } from "react";

const SaveButton = ({ isSaved, toggleSave, colors }) => {
  return (
    <TouchableOpacity onPress={toggleSave}>
      <Icon
        name={isSaved ? "bookmark" : "bookmark-outline"}
        size={32}
        color={colors.inactiveIcon}
      />
    </TouchableOpacity>
  );
};

export default memo(SaveButton);
