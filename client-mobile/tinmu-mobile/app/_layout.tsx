// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthThemeProvider } from "../contexts/AuthThemeContext";

export default function Layout() {
  return (
    <AuthThemeProvider>
      <Stack />
    </AuthThemeProvider>
  );
}
