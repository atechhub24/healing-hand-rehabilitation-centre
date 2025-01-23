"use client";

import { useThemeStore } from "@/lib/store/theme-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeSwitcher() {
  const { theme, primaryColor, toggleTheme, setPrimaryColor } = useThemeStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-9 h-9 rounded-lg"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
          {theme === "light" ? (
            <Sun className="h-4 w-4 mr-2" />
          ) : (
            <Moon className="h-4 w-4 mr-2" />
          )}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Primary Color
          </p>
          <div className="flex gap-2">
            <button
              className={cn(
                "w-8 h-8 rounded-lg bg-emerald-500 hover:scale-110 transition-transform",
                primaryColor === "emerald" &&
                  "ring-2 ring-offset-2 ring-emerald-500"
              )}
              onClick={() => setPrimaryColor("emerald")}
            >
              <span className="sr-only">Emerald theme</span>
            </button>
            <button
              className={cn(
                "w-8 h-8 rounded-lg bg-orange-500 hover:scale-110 transition-transform",
                primaryColor === "orange" &&
                  "ring-2 ring-offset-2 ring-orange-500"
              )}
              onClick={() => setPrimaryColor("orange")}
            >
              <span className="sr-only">Orange theme</span>
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
