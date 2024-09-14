import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { screenWidth } from "../utils/constants";
import { getIconSource } from "../utils/helper";
import { View } from "react-native";

export default SearchedUser = ({ item, navigation }) => {
  const iconBgColor = item.icon?.bgColor || "transparent";
  const iconSource = getIconSource(item?.icon);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      onPress={() => {
        navigation.navigate("UserProfile", {
          isStack: true,
          targetId: item._id,
        });
      }}
    >
      <Image
        source={iconSource}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: iconBgColor,
        }}
      />
      <View style={{ justifyContent: "center", paddingLeft: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          {item.displayName}
        </Text>
        {item.isFollowing === true && (
          <Text style={{ color: "grey" }}>following</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: screenWidth,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
});
