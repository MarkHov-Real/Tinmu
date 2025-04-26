import { Stack } from "expo-router";
import { View, useColorScheme, StatusBar } from "react-native";

export default function Layout() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#121212" : "#ffffff" }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? "#121212" : "#ffffff",
          },
          headerTintColor: isDark ? "#ffffff" : "#000000",
        }}
      />
    </View>
  );
}
