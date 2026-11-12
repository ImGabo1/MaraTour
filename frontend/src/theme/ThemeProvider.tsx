import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ColorTheme = "light" | "dark";

interface ThemeContextValue {
  theme: ColorTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const STORAGE_KEY = "maratours.theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): ColorTheme {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ColorTheme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#102536" : "#f5fbff"
    );
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // El tema también funciona en sesiones sin almacenamiento local.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", toggleTheme }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return value;
}
