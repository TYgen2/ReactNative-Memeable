import { StyleSheet, View } from "react-native";
import { screenWidth } from "../utils/constants";
import TabItem from "./tabItem";
import PostButton from "./postButton";

export default CustomTab = ({ state, descriptors, navigation }) => {
  return (
    <View>
      <PostButton />
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TabItem
              key={route.name}
              onPress={onPress}
              isFocused={isFocused}
              routeName={route.name}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    width: screenWidth * 0.9,
    justifyContent: "space-evenly",
    alignSelf: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    backgroundColor: "rgba(43,43,43, 0.95)",
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 50,
    elevation: 4,
    zIndex: 4,
    shadowColor: "#5D3FD3",
  },
});
