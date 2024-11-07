import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import useColorTheme from "../../hooks/useColorTheme";
import { getData, storeData } from "../../config/asyncStorage";

export default AppSetting = () => {
  const { colors, mode, updateTheme } = useColorTheme();

  const [isDark, setIsDark] = useState(mode === "dark");
  const [autoplayBGM, setAutoplayBGM] = useState(false);

  useEffect(() => {
    const loadAutoplaySettings = async () => {
      const savedAutoplay = await getData("autoplayBGM");
      if (savedAutoplay !== null) {
        setAutoplayBGM(savedAutoplay);
      }
    };
    loadAutoplaySettings();
  }, []);

  const toggleSwitch = () => {
    updateTheme();
    setIsDark((prev) => !prev);
  };

  const toggleAutoplay = async () => {
    const newValue = !autoplayBGM;
    setAutoplayBGM(newValue);
    await storeData("autoplayBGM", newValue);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={[styles.header, { color: colors.text }]}>Display</Text>
      <View style={styles.section}>
        <Text style={[styles.optionText, { color: colors.text }]}>
          Dark mode
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#CCCCFF" }}
          thumbColor={isDark ? "#7F00FF" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isDark}
        />
      </View>

      <Text style={[styles.header, { color: colors.text }]}>Behavior</Text>
      <View style={styles.section}>
        <Text style={[styles.optionText, { color: colors.text }]}>
          Auto play BGM in user profile if exist
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#CCCCFF" }}
          thumbColor={autoplayBGM ? "#7F00FF" : "#f4f3f4"}
          onValueChange={toggleAutoplay}
          value={autoplayBGM}
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
  header: {
    paddingTop: 10,
    alignSelf: "flex-start",
    paddingLeft: 20,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  section: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
});
