import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import useColorTheme from "../../hooks/useColorTheme";

export default AppSetting = () => {
  const { colors, mode, updateTheme } = useColorTheme();

  const [isEnabled, setIsEnabled] = useState(mode === "dark");
  const toggleSwitch = () => {
    updateTheme();
    setIsEnabled((previousState) => !previousState);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={[styles.displayHeader, { color: colors.text }]}>
        Display
      </Text>
      <View style={styles.displaySection}>
        <Text style={[styles.darkMode, { color: colors.text }]}>Dark mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#CCCCFF" }}
          thumbColor={isEnabled ? "#7F00FF" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  displayHeader: {
    paddingTop: 10,
    alignSelf: "flex-start",
    paddingLeft: 24,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  displaySection: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 10,
  },
  darkMode: {
    fontSize: 16,
  },
});
