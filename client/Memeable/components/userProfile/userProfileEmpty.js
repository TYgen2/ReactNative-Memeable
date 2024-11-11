import { StyleSheet, Text, View, Image } from "react-native";
import { memo } from "react";
import { LOADING_INDICATOR } from "../../utils/constants";

const UserProfileEmpty = ({ isPostsLoading, colors }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {isPostsLoading ? (
        <LOADING_INDICATOR bgColor={colors.primary} />
      ) : (
        <>
          <Image
            source={require("../../assets/empty_icon/acheron.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>This user has no posts</Text>
        </>
      )}
    </View>
  );
};

export default memo(UserProfileEmpty);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    flex: 1,
    paddingBottom: 100,
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    color: "grey",
    paddingBottom: 100,
  },
  icon: {
    width: 80,
    height: 80,
    opacity: 0.4,
  },
});
