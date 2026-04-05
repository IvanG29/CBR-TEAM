"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeButtonProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const ThemeButton: React.FC<ThemeButtonProps> = ({
  theme,
  toggleTheme,
}) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-gray-100 dark:bg-zinc-800 transition-colors duration-300 shadow-lg border border-gray-200 dark:border-zinc-700"
      aria-label="Сменить тему"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-gray-500" />
      ) : (
        <Sun className="w-5 h-5 text-white" />
      )}
    </button>
  );
};
