// theme.ts
import { useColorScheme } from "react-native";

const lightColors = {
  background: "#ffffff",
  text: "#000000",
  secondaryText: "#444",
};

const darkColors2 = {
  background: "#373B40",
  text: "#ffffff",
  secondaryText: "#ccc",
  backgroundColorInput : "#464a4e",
};
const darkColors = {
  background: "#3E505B",
  text: "#ffffff",
  secondaryText: "#ccc",
  backgroundColorInput : "#464a4e",
};


export function useTheme() {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;
  return { colors, scheme };
}
