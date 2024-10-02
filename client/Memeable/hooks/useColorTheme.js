import { useContext } from "react";
import { ThemeContext } from "../context/theme";
import { colors } from "../config/colorScheme";

export default useColorTheme = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const activeColor = colors[theme.mode];

  return {
    mode: theme.mode,
    colors: activeColor,
    updateTheme,
  };
};
