import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({ theme: "system", setTheme: () => {}, toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system");

  // Apply theme to <html data-theme>
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored) {
      setTheme(stored);
    } else {
      setTheme("system");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (t) => {
      if (t === "light" || t === "dark") {
        root.setAttribute("data-theme", t);
      } else {
        // Follow system
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.setAttribute("data-theme", prefersDark ? "dark" : "light");
      }
    };

    apply(theme);

    // Update on system change when in system mode
    let mql;
    const handleChange = (e) => {
      if (theme === "system") apply(e.matches ? "dark" : "light");
    };
    if (theme === "system" && window.matchMedia) {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", handleChange);
    }
    return () => {
      if (mql) mql.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme: (t) => {
      setTheme(t);
      if (t === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", t);
    },
    toggleTheme: () => {
      setTheme((prev) => {
        const root = document.documentElement;
        const current = root.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";
        localStorage.setItem("theme", next);
        return next; // exit system mode when toggled
      });
    },
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
