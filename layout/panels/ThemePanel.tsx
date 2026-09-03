import { useEffect, useState } from "react";
import "@style/layout/theme-panel.css";

const THEME_OPTIONS = [
  { id: "cyan", label: "[01]", color: "#29e8ff" },
  { id: "amber", label: "[02]", color: "#ffb000" },
  { id: "green", label: "[03]", color: "#55ff55" },
];

export default function ThemePanel() {
  const [theme, setTheme] = useState("cyan");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="panel panel--theme hud-theme-selector">

      {THEME_OPTIONS.map((option) => (
        <button
          key={option.id}
          className={`theme-swatch ${theme === option.id ? "theme-swatch--active" : ""}`}
          style={{ color: option.color } as React.CSSProperties}
          onClick={() => setTheme(option.id)}
          aria-label={`Set theme ${option.id}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("ThemePanel loaded");
}
