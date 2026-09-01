import { useEffect } from "react";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

import { gridExpandSound } from "@core/audio/Audio";

import "@style/transitions/grid.css";

type Props = {
  onComplete: () => void;
};

export default function GridTransition({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);

    const soundTimer = setTimeout(gridExpandSound, 0);

    return () => {
      clearTimeout(timer);
      clearTimeout(soundTimer);
    };
  }, [onComplete]);

  const verticalLines = Array.from({ length: 15 });
  const horizontalLines = Array.from({ length: 9 });
  const gridPoints = Array.from({ length: 35 });

  return (
    <div className="grid-transition">
      <div className="grid-transition-inner">
        <div className="system-grid">
          <div className="grid-vertical-lines">
            {verticalLines.map((_, index) => (
              <span
                key={`vertical-${index}`}
                className="grid-vertical-line"
                style={{
                  animationDelay: `${index * 0.06}s`,
                }}
              />
            ))}
          </div>

          <div className="grid-horizontal-lines">
            {horizontalLines.map((_, index) => (
              <span
                key={`horizontal-${index}`}
                className="grid-horizontal-line"
                style={{
                  animationDelay: `${index * 0.08}s`,
                }}
              />
            ))}
          </div>

          <div className="grid-points">
            {gridPoints.map((_, index) => (
              <span
                key={`point-${index}`}
                className="grid-point"
                style={{
                  animationDelay: `${(index % 10) * 0.12}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid-core">
          <div className="grid-core-glow" />
          <div className="grid-core-ring grid-core-ring-outer" />
          <div className="grid-core-ring grid-core-ring-middle" />
          <div className="grid-core-ring grid-core-ring-inner" />
          <div className="grid-core-icon">
            <ThemeableIcon />
          </div>
        </div>

        <div className="grid-status">
          <div className="grid-status-label">SYSTEM CORE</div>

          <div className="grid-status-substatus">ENVIRONMENT INITIALIZING</div>
        </div>
      </div>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("grid transition rendered");
}
