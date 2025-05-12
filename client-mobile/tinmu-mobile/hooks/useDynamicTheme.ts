// hooks/useDynamicTheme.ts
type Tempo = "slow" | "fast" | "blues";

export function useDynamicTheme(userTempo?: Tempo) {
    const themesByTempo: Record<Tempo, {inputButtonColor?:string; inputButtonBackground?:string; textColor: string; buttonText: string; background: string; text: string; secondaryText: string; backgroundColorInput?: string }> = {
      slow: {
        background: "#03120e",
        text: "#f0f0f0",
        textColor: "#EAEFF2",
        secondaryText: "#a0a0a0",
        inputButtonColor: "#3e505b",
        inputButtonBackground: "#1A1D1A",
        buttonText: "#f9edcc",
      },
      fast: {
        background: "#2e282a",
        text: "#f9edcc",
        textColor: "#ffe381",
        backgroundColorInput: "#f0f0f0",
        secondaryText: "#a0a0a0",
        inputButtonColor: "#dc602e",
        inputButtonBackground: "#dc602e",
        buttonText: "#f0f0f0",

      },
      blues: {
        background: "#2d3e50",
        textColor: "#ffe381",
        text: "#a3c6ff",
        secondaryText: "#a0a0a0",
        inputButtonBackground: "#dc602e",
        inputButtonColor: "#f0f0f0",
        buttonText: "#f0f0f0",

      },
    };
    const currentTheme = themesByTempo[userTempo ?? "slow"];
    // fallback to "slow" theme if undefined or wrong
  
    return {
      colors: currentTheme,
    };
  }
  