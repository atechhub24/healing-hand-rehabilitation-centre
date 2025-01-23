"use client";

import { useThemeStore } from "@/lib/store/theme-store";
import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const colors = {
  emerald: {
    light: {
      primary: "emerald-500",
      hover: "emerald-600",
      text: "emerald-500",
      hoverText: "emerald-600",
      border: "emerald-500",
      ring: "emerald-500",
      background: "white",
      foreground: "gray-900",
    },
    dark: {
      primary: "emerald-400",
      hover: "emerald-500",
      text: "emerald-400",
      hoverText: "emerald-500",
      border: "emerald-400",
      ring: "emerald-400",
      background: "gray-900",
      foreground: "white",
    },
  },
  orange: {
    light: {
      primary: "orange-500",
      hover: "orange-600",
      text: "orange-500",
      hoverText: "orange-600",
      border: "orange-500",
      ring: "orange-500",
      background: "white",
      foreground: "gray-900",
    },
    dark: {
      primary: "orange-400",
      hover: "orange-500",
      text: "orange-400",
      hoverText: "orange-500",
      border: "orange-400",
      ring: "orange-400",
      background: "gray-900",
      foreground: "white",
    },
  },
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, primaryColor } = useThemeStore();

  // Update theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Update CSS variables for the selected primary color
    const colorSet = colors[primaryColor][theme];

    // Set the HSL values for the theme
    if (theme === "light") {
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--popover", "0 0% 100%");
      root.style.setProperty("--popover-foreground", "222.2 84% 4.9%");
      root.style.setProperty(
        "--primary",
        primaryColor === "emerald" ? "142.1 76.2% 36.3%" : "24.6 95% 53.1%"
      );
      root.style.setProperty("--primary-foreground", "355.7 100% 97.3%");
      root.style.setProperty("--secondary", "210 40% 96.1%");
      root.style.setProperty("--secondary-foreground", "222.2 47.4% 11.2%");
      root.style.setProperty("--muted", "210 40% 96.1%");
      root.style.setProperty("--muted-foreground", "215.4 16.3% 46.9%");
      root.style.setProperty("--accent", "210 40% 96.1%");
      root.style.setProperty("--accent-foreground", "222.2 47.4% 11.2%");
      root.style.setProperty("--destructive", "0 84.2% 60.2%");
      root.style.setProperty("--destructive-foreground", "210 40% 98%");
      root.style.setProperty("--border", "214.3 31.8% 91.4%");
      root.style.setProperty("--input", "214.3 31.8% 91.4%");
      root.style.setProperty(
        "--ring",
        primaryColor === "emerald" ? "142.1 76.2% 36.3%" : "24.6 95% 53.1%"
      );
    } else {
      root.style.setProperty("--background", "222.2 84% 4.9%");
      root.style.setProperty("--foreground", "210 40% 98%");
      root.style.setProperty("--card", "222.2 84% 4.9%");
      root.style.setProperty("--card-foreground", "210 40% 98%");
      root.style.setProperty("--popover", "222.2 84% 4.9%");
      root.style.setProperty("--popover-foreground", "210 40% 98%");
      root.style.setProperty(
        "--primary",
        primaryColor === "emerald" ? "142.1 70.6% 45.3%" : "20.5 90% 48.2%"
      );
      root.style.setProperty("--primary-foreground", "144.9 80.4% 10%");
      root.style.setProperty("--secondary", "217.2 32.6% 17.5%");
      root.style.setProperty("--secondary-foreground", "210 40% 98%");
      root.style.setProperty("--muted", "217.2 32.6% 17.5%");
      root.style.setProperty("--muted-foreground", "215 20.2% 65.1%");
      root.style.setProperty("--accent", "217.2 32.6% 17.5%");
      root.style.setProperty("--accent-foreground", "210 40% 98%");
      root.style.setProperty("--destructive", "0 62.8% 30.6%");
      root.style.setProperty("--destructive-foreground", "210 40% 98%");
      root.style.setProperty("--border", "217.2 32.6% 17.5%");
      root.style.setProperty("--input", "217.2 32.6% 17.5%");
      root.style.setProperty(
        "--ring",
        primaryColor === "emerald" ? "142.1 70.6% 45.3%" : "20.5 90% 48.2%"
      );
    }
  }, [theme, primaryColor]);

  return <>{children}</>;
}
