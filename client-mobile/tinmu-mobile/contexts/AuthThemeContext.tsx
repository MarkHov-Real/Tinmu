// contexts/AuthThemeContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useDynamicTheme } from "../hooks/useDynamicTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the shape of the context
const AuthThemeContext = createContext<{
  colors: { background: string; text: string };
  loading: boolean;
  setThemeTempo: (tempo: string) => void;
}>({
  colors: { background: "#000", text: "#fff" }, // fallback
  loading: true,
  setThemeTempo: () => {},
});

// The Provider component
export function AuthThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeTempo, setThemeTempo] = useState<string>("slow");
  const { colors } = useDynamicTheme(themeTempo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTempo = await AsyncStorage.getItem("themeTempo");
      if (storedTempo) {
        setThemeTempo(storedTempo);
      }
      setLoading(false);
    };
    loadTheme();
  }, []);

  console.log("Theme Tempo:", themeTempo);
  console.log("Theme Colors:", colors);
  return (
    <AuthThemeContext.Provider value={{ colors, loading, setThemeTempo }}>
      {children}
    </AuthThemeContext.Provider>
  );
}

// Hook to access the context
export function useUserAuthTheme() {
  return useContext(AuthThemeContext);
}
