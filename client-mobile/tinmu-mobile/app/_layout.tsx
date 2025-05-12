import { Slot } from "expo-router";
import { AuthThemeProvider } from "../contexts/AuthThemeContext";

export default function RootLayout() {
  return (
    <AuthThemeProvider>
      <Slot />
    </AuthThemeProvider>
  );
}
