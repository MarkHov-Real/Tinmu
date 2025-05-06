// hooks/useAuthTheme.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDynamicTheme } from "./useDynamicTheme";  // ← your existing dynamic theme

export function useAuthTheme() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // default to "fast" BEFORE we know user
  const { colors } = useDynamicTheme(user?.name || "fast");

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("❌ No token found → using fast theme");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://10.0.0.220:3000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          console.log("✅ Authenticated user:", data);
          setUser(data);
        } else {
          console.warn("⚠️ Failed to fetch user:", data);
        }
      } catch (err) {
        console.error("🔥 Error checking auth:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  console.log("🔄 From userUserAuthTheme : User auth theme updated:", {  colors, loading });

  return {  colors, loading };
}
