import { memo, useCallback } from "react";
import useColorTheme from "../../hooks/useColorTheme";
import MainPost from "../../components/post/MainPost";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

const DetailedPost = ({ route, navigation }) => {
  const { colors } = useColorTheme();
  const { item, fromProfile } = route.params;

  // Get latest post state from Redux
  const updatedPost = useSelector(
    (state) => state.post.allPosts.find((p) => p._id === item._id) || item
  );

  const handleDeleteSuccess = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{ backgroundColor: colors.primary }}
    >
      <View style={{ alignItems: "center" }}>
        <MainPost
          key={`${updatedPost._id}-${updatedPost.isSaved}-${updatedPost.hasLiked}`}
          item={item}
          navigation={navigation}
          colors={colors}
          fromProfile={fromProfile}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </View>
    </ScrollView>
  );
};
export default memo(DetailedPost);
