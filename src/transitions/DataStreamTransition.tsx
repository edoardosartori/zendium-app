import { useEffect } from "react";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

import "@style/transitions/data-stream.css";

type Props = {
  onComplete: () => void;
};

export default function DataStreamTransition({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const dataColumns = Array.from({ length: 12 });
  const coreLines = Array.from({ length: 8 });

  return (
    <div className="data-stream-transition">
      <div className="data-stream-transition-inner">
        {/* DATA STREAM */}
        <div className="data-stream">
          {dataColumns.map((_, index) => (
            <div
              key={index}
              className="data-column"
              style={{
                animationDelay: `${index * 0.12}s`,
              }}
            >
              <span>0101</span>
              <span>1100</span>
              <span>0011</span>
              <span>1010</span>
              <span>0110</span>
              <span>1001</span>
              <span>1110</span>
              <span>0001</span>
            </div>
          ))}
        </div>

        {/* CENTRAL CORE */}
        <div className="data-core">
          {/* CONVERGING LINES */}
          <div className="core-lines">
            {coreLines.map((_, index) => (
              <span
                key={index}
                className="core-line"
                style={{
                  transform: `rotate(${index * 45}deg)`,
                }}
              />
            ))}
          </div>

          {/* CORE RINGS */}
          <div className="core-ring core-ring-outer" />
          <div className="core-ring core-ring-middle" />
          <div className="core-ring core-ring-inner" />

          {/* ICON */}
          <div className="data-core-icon">
            <ThemeableIcon />
          </div>
        </div>

        {/* STATUS */}
        <div className="data-stream-status">
          <div className="data-stream-label">LOADING ZENDIUM SYSTEM</div>
        </div>
      </div>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("data stream transition loaded");
}
