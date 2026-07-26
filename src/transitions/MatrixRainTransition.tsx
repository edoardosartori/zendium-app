import { useEffect } from "react";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

import "@style/transitions/matrix-rain.css";

type Props = {
  onComplete: () => void;
};

const matrixCharacters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%<>[]{}";

export default function MatrixRainTransition({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const columns = Array.from({ length: 28 });

  return (
    <div className="matrix-transition">
      <div className="matrix-transition-inner">
        <div className="matrix-rain">
          {columns.map((_, columnIndex) => (
            <div
              className="matrix-column"
              key={columnIndex}
              style={{
                animationDelay: `${(columnIndex % 9) * 0.12}s`,
                animationDuration: `${2.5 + (columnIndex % 5) * 0.3}s`,
              }}
            >
              {Array.from({ length: 18 }).map((_, characterIndex) => (
                <span
                  key={characterIndex}
                  style={{
                    animationDelay: `${characterIndex * 0.08}s`,
                  }}
                >
                  {
                    matrixCharacters[
                      Math.floor(Math.random() * matrixCharacters.length)
                    ]
                  }
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="matrix-core">
          <div className="matrix-core-glow" />
          <div className="matrix-core-frame">
            <ThemeableIcon />
          </div>
        </div>
        <div className="matrix-status">
          <div className="matrix-status-label">SYSTEM MATRIX</div>
          <div className="matrix-status-substatus">INITIALIZING</div>
        </div>
      </div>
    </div>
  );
}

console.log("matrix rain transition rendered");
