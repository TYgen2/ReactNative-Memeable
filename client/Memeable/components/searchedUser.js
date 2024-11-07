import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { screenWidth } from "../utils/constants";
import { getIconSource, navigateToUserProfile } from "../utils/helper";
import FastImage from "react-native-fast-image";
import { memo } from "react";
import Icon from "react-native-vector-icons/Ionicons";

export default SearchedUser = memo(({ item, navigation, colors }) => {
  const iconBgColor = item.icon?.bgColor || "transparent";
  const iconSource = getIconSource(item?.icon);
  const hasSong = item.song?.songUri ? true : false;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      onPress={() => navigateToUserProfile(navigation, item._id)}
    >
      <FastImage
        source={iconSource}
        style={[styles.icon, { backgroundColor: iconBgColor }]}
      />
      <View style={styles.textInfo}>
        <Text style={[styles.displayName, { color: colors.text }]}>
          {item.displayName}
        </Text>
        {item.isFollowing === true && (
          <Text style={styles.followStatus}>following</Text>
        )}
      </View>

      {hasSong && (
        <Icon
          name="musical-notes-outline"
          size={24}
          color="grey"
          style={styles.hasSongIcon}
        />
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: screenWidth,
    marginHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  hasSongIcon: { marginLeft: "auto", marginRight: 24 },
  textInfo: { justifyContent: "center", paddingLeft: 10 },
  displayName: { fontWeight: "bold", fontSize: 16 },
  followStatus: { color: "grey" },
});
