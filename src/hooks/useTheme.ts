import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

function systemDark() {
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

function current(): Theme {
  const set = document.documentElement.dataset.theme as Theme | undefined;
  return set ?? (systemDark() ? "dark" : "light");
}

/** Light/dark with the OS as the default and localStorage as the override. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => current());

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!document.documentElement.dataset.theme) setTheme(current());
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("pp-theme", next);
    } catch {
      /* private mode */
    }
    setTheme(next);
  }, []);

  return { theme, toggle };
}
