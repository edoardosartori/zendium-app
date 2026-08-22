import { useEffect, useState } from "react";

export default function ThemePanel() {
  const [theme, setTheme] = useState("cyan");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="panel panel--theme">
      <button
        className={`theme-swatch ${theme === "cyan" ? "theme-swatch--active" : ""}`}
        style={{ background: "#29e8ff", color: "#29e8ff" }}
        onClick={() => setTheme("cyan")}
        aria-label="Tema cyan"
      />
      <button
        className={`theme-swatch ${theme === "amber" ? "theme-swatch--active" : ""}`}
        style={{ background: "#ffb000", color: "#ffb000" }}
        onClick={() => setTheme("amber")}
        aria-label="Tema amber"
      />
      <button
        className={`theme-swatch ${theme === "green" ? "theme-swatch--active" : ""}`}
        style={{ background: "#55ff55", color: "#55ff55" }}
        onClick={() => setTheme("green")}
        aria-label="Tema green"
      />
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("ThemePanel rendered");
}

