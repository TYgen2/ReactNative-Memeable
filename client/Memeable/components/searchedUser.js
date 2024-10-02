import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { screenWidth } from "../utils/constants";
import { getIconSource, navigateToUserProfile } from "../utils/helper";
import { memo } from "react";

export default SearchedUser = memo(({ item, navigation, colors }) => {
  const iconBgColor = item.icon?.bgColor || "transparent";
  const iconSource = getIconSource(item?.icon);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      onPress={() => navigateToUserProfile(navigation, item._id)}
    >
      <Image
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
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: screenWidth,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textInfo: { justifyContent: "center", paddingLeft: 10 },
  displayName: { fontWeight: "bold", fontSize: 16 },
  followStatus: { color: "grey" },
});
