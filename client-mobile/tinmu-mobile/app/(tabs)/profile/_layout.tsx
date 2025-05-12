import { AuthThemeProvider } from "../../../contexts/AuthThemeContext";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <AuthThemeProvider>
      <Tabs>
        <Tabs.Screen
          name="login"
          options={{
            title: "Login",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="signup" options={{ href: null }} />
        <Tabs.Screen name="index" options={{ href: null }} />

        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Profile", // This changes the header text
            tabBarLabel: "Profile", // This changes the bottom tab text
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthThemeProvider>
  );
}
