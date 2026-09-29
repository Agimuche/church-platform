"use client";

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    media.removeEventListener("change", callback);
  };
}

function getClientSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("tbc-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [overrideTheme, setOverrideTheme] = useState<Theme | null>(null);

  const activeTheme = overrideTheme ?? currentTheme;

  useEffect(() => {
    const root = document.documentElement;
    if (activeTheme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [activeTheme]);

  const setTheme = useCallback((t: Theme) => {
    try {
      localStorage.setItem("tbc-theme", t);
    } catch {
      // Ignore
    }
    setOverrideTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(activeTheme === "dark" ? "light" : "dark");
  }, [activeTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        resolvedTheme: activeTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
