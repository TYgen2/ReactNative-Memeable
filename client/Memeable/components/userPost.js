import { Image, TouchableOpacity } from "react-native";
import { screenWidth } from "../utils/constants";

export default UserPost = ({ item }) => {
  return (
    <TouchableOpacity
      style={{ margin: 1 }}
      activeOpacity={0.8}
      onPress={() => console.log(item)}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={{ width: screenWidth / 3, height: screenWidth / 3 }}
      />
    </TouchableOpacity>
  );
};
