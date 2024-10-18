import { memo } from "react";
import useColorTheme from "../../hooks/useColorTheme";
import MainPost from "../../components/post/MainPost";
import { ScrollView, View } from "react-native";

const DetailedPost = ({ route, navigation }) => {
  const { colors } = useColorTheme();
  const { item } = route.params;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{ backgroundColor: colors.primary }}
    >
      <View style={{ alignItems: "center" }}>
        <MainPost item={item} navigation={navigation} colors={colors} />
      </View>
    </ScrollView>
  );
};
export default memo(DetailedPost);
