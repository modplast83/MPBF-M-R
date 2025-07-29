import { useState, useEffect } from "react";

interface ThemeConfig {
  primary: string;
  variant: "professional" | "tint" | "vibrant";
  appearance: "light" | "dark" | "system";
  radius: number;
}

const DEFAULT_THEME: ThemeConfig = {
  primary: "#2563eb",
  variant: "professional",
  appearance: "light",
  radius: 0.5,
};

export function useTheme() {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("app-theme");
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        setTheme({ ...DEFAULT_THEME, ...parsed });
      }
    } catch (error) {
      console.warn("Failed to load saved theme:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    
    // Apply theme based on primary color and variant
    applyThemeColors(root, theme);
    
    // Apply border radius
    root.style.setProperty("--radius", `${theme.radius}rem`);
    
    // Handle dark/light mode
    if (theme.appearance === "dark") {
      root.classList.add("dark");
    } else if (theme.appearance === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (mediaQuery.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme, isLoading]);

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    const updatedTheme = { ...theme, ...newTheme };
    setTheme(updatedTheme);
    
    // Save to localStorage
    try {
      localStorage.setItem("app-theme", JSON.stringify(updatedTheme));
    } catch (error) {
      console.warn("Failed to save theme:", error);
    }
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    localStorage.removeItem("app-theme");
  };

  return {
    theme,
    updateTheme,
    resetTheme,
    isLoading,
  };
}

function applyThemeColors(root: HTMLElement, theme: ThemeConfig) {
  const { primary, variant, appearance } = theme;
  
  // Convert hex to HSL
  const hsl = hexToHsl(primary);
  
  if (appearance === "dark") {
    // Dark theme colors
    root.style.setProperty("--background", "222 84% 4%");
    root.style.setProperty("--foreground", "210 40% 98%");
    root.style.setProperty("--card", "222 84% 4%");
    root.style.setProperty("--card-foreground", "210 40% 98%");
    root.style.setProperty("--popover", "222 84% 4%");
    root.style.setProperty("--popover-foreground", "210 40% 98%");
    root.style.setProperty("--primary", `${hsl.h} ${hsl.s}% ${Math.min(hsl.l + 10, 90)}%`);
    root.style.setProperty("--primary-foreground", "222 84% 4%");
    root.style.setProperty("--secondary", "217 33% 17%");
    root.style.setProperty("--secondary-foreground", "210 40% 98%");
    root.style.setProperty("--muted", "217 33% 17%");
    root.style.setProperty("--muted-foreground", "215 20% 65%");
    root.style.setProperty("--accent", "217 33% 17%");
    root.style.setProperty("--accent-foreground", "210 40% 98%");
    root.style.setProperty("--destructive", "0 62% 30%");
    root.style.setProperty("--destructive-foreground", "210 40% 98%");
    root.style.setProperty("--border", "217 33% 17%");
    root.style.setProperty("--input", "217 33% 17%");
    root.style.setProperty("--ring", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  } else {
    // Light theme colors
    root.style.setProperty("--background", "0 0% 100%");
    root.style.setProperty("--foreground", "222 84% 4%");
    root.style.setProperty("--card", "0 0% 100%");
    root.style.setProperty("--card-foreground", "222 84% 4%");
    root.style.setProperty("--popover", "0 0% 100%");
    root.style.setProperty("--popover-foreground", "222 84% 4%");
    root.style.setProperty("--primary", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    root.style.setProperty("--primary-foreground", "210 40% 98%");
    root.style.setProperty("--secondary", "210 40% 96%");
    root.style.setProperty("--secondary-foreground", "222 84% 4%");
    root.style.setProperty("--muted", "210 40% 96%");
    root.style.setProperty("--muted-foreground", "215 16% 47%");
    root.style.setProperty("--accent", "210 40% 96%");
    root.style.setProperty("--accent-foreground", "222 84% 4%");
    root.style.setProperty("--destructive", "0 84% 60%");
    root.style.setProperty("--destructive-foreground", "210 40% 98%");
    root.style.setProperty("--border", "214 32% 91%");
    root.style.setProperty("--input", "214 32% 91%");
    root.style.setProperty("--ring", `${hsl.h} ${hsl.s}% ${hsl.l}%`);
  }

  // Apply variant-specific adjustments
  if (variant === "vibrant") {
    // Increase saturation for vibrant themes
    root.style.setProperty("--primary", `${hsl.h} ${Math.min(hsl.s + 20, 100)}% ${hsl.l}%`);
  } else if (variant === "tint") {
    // Lighter primary for tint themes
    root.style.setProperty("--primary", `${hsl.h} ${hsl.s}% ${Math.min(hsl.l + 15, 85)}%`);
  }
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace("#", "");
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}