// hooks/useDynamicTheme.ts
type Tempo = "slow" | "fast" | "blues";

export function useDynamicTheme(userTempo?: Tempo) {
    const themesByTempo: Record<Tempo, { background: string; text: string; secondaryText: string; backgroundColorInput?: string }> = {
      slow: {
        background: "#1e1e2e",
        text: "#f0f0f0",
        secondaryText: "#a0a0a0",
      },
      fast: {
        background: "#fce300",
        text: "#000",
        backgroundColorInput: "#f0f0f0",
        secondaryText: "#a0a0a0",
      },
      blues: {
        background: "#2d3e50",
        text: "#a3c6ff",
        secondaryText: "#a0a0a0",
      },
    };
    const currentTheme = themesByTempo[userTempo ?? "slow"];
    // fallback to "slow" theme if undefined or wrong
  
    return {
      colors: currentTheme,
    };
  }
  