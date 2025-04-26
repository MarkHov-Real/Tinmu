// hooks/useDynamicTheme.ts
export function useDynamicTheme(userTempo?: string) {
    const themesByTempo = {
      slow: {
        background: "#1e1e2e",
        text: "#f0f0f0",
      },
      fast: {
        background: "#fce300",
        text: "#000",
      },
      blues: {
        background: "#2d3e50",
        text: "#a3c6ff",
      },
    };
  
    // fallback to "slow" theme if undefined or wrong
    const currentTheme = themesByTempo[userTempo || "slow"] || themesByTempo["slow"];
  
    return {
      colors: currentTheme,
    };
  }
  