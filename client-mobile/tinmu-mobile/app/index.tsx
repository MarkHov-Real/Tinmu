// app/index.tsx
import { useEffect } from "react";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { storage } from "../utils/storage"; //

export default function IndexRedirector() {
  useEffect(() => {
    const checkToken = async () => {
      const token = await storage.getItem("token");
      console.log("🔄 From index.tsx: Token loaded", token);

      if (token) {
        router.replace("/(tabs)/profile"); // ✅ Go to home tab
      } else {
        router.replace("/auth/login"); // ❌ Not authenticated
      }
    };

    checkToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
