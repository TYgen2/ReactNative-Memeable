import { StyleSheet, View } from "react-native";
import { screenWidth } from "../../utils/constants";
import TabItem from "./tabItem";
import PostButton from "./postButton";
import { memo, useCallback } from "react";
import useColorTheme from "../../hooks/useColorTheme";

export default CustomTab = memo(({ state, descriptors, navigation }) => {
  const { colors } = useColorTheme();

  return (
    <View>
      <PostButton />
      <View style={[styles.tabBar, { backgroundColor: colors.tabBar }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title;
          const isFocused = state.index === index;

          const onPress = useCallback(() => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }, [isFocused, navigation, route.name, route.params]);

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
});

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    width: screenWidth - 10,
    justifyContent: "space-evenly",
    alignSelf: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 5,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 4,
    zIndex: 4,
    shadowColor: "#5D3FD3",
  },
});
