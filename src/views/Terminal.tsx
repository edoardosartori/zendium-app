import ThemeableIcon from "@assets/themeable-icon.svg?react";

export default function Terminal() {
  return (
    <div className="terminal-view">
      <ThemeableIcon className="terminal-icon" />
        <div className="terminal-container">
          {/* Terminale vero e proprio */}
        </div>
    </div>
  );
}

console.log("terminal rendered");
