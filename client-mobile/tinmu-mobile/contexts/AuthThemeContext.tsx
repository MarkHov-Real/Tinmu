import { createContext, useContext, useEffect, useState } from "react";
import { useDynamicTheme } from "../hooks/useDynamicTheme";
import { storage } from "@/utils/storage";

export const AuthThemeContext = createContext({
  colors: { background: "#000", text: "#fff" },
  loading: true,
  setThemeTempo: (tempo: string) => {},
});

export function AuthThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeTempo, setThemeTempo] = useState("fast");
  const [loading, setLoading] = useState(true);

  const { colors } = useDynamicTheme(themeTempo);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTempo = await storage.getItem("themeTempo");
      if (storedTempo) {
        setThemeTempo(storedTempo);
      }
      setLoading(false);
    };
    loadTheme();
  }, []);

  return (
    <AuthThemeContext.Provider value={{ colors, loading, setThemeTempo }}>
      {children}
    </AuthThemeContext.Provider>
  );
}

export function useUserAuthTheme() {
  return useContext(AuthThemeContext);
}
