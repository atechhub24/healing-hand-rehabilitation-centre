"use client";

import { useThemeStore } from "@/lib/store/theme-store";
import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, primaryColor } = useThemeStore();

  // Update theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

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
      root.style.setProperty("--primary-foreground", "0 0% 98%");
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
      root.style.setProperty("--background", "224 71% 4%");
      root.style.setProperty("--foreground", "213 31% 91%");
      root.style.setProperty("--card", "224 71% 4%");
      root.style.setProperty("--card-foreground", "213 31% 91%");
      root.style.setProperty("--popover", "224 71% 4%");
      root.style.setProperty("--popover-foreground", "215 20.2% 65.1%");
      root.style.setProperty(
        "--primary",
        primaryColor === "emerald" ? "142.1 70.6% 45.3%" : "20.5 90% 48.2%"
      );
      root.style.setProperty("--primary-foreground", "0 0% 100%");
      root.style.setProperty("--secondary", "222.2 47.4% 11.2%");
      root.style.setProperty("--secondary-foreground", "210 40% 98%");
      root.style.setProperty("--muted", "223 47% 11%");
      root.style.setProperty("--muted-foreground", "215.4 16.3% 56.9%");
      root.style.setProperty("--accent", "216 34% 17%");
      root.style.setProperty("--accent-foreground", "210 40% 98%");
      root.style.setProperty("--destructive", "0 63% 31%");
      root.style.setProperty("--destructive-foreground", "210 40% 98%");
      root.style.setProperty("--border", "216 34% 17%");
      root.style.setProperty("--input", "216 34% 17%");
      root.style.setProperty(
        "--ring",
        primaryColor === "emerald" ? "142.1 70.6% 45.3%" : "20.5 90% 48.2%"
      );
    }
  }, [theme, primaryColor]);

  return <>{children}</>;
}
