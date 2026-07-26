import { useEffect } from "react";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

import "@style/transitions/scan.css";

type Props = {
  onComplete: () => void;
};

export default function ScanTransition({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="scan-transition">
      <div className="scan-transition-inner">

        {/* CENTRAL VISUAL */}
        <div className="scan-visual">

          {/* SCAN LINE */}
          <div className="scan-line" />

          {/* HUD */}
          <div className="scan-hud">
            <div className="scan-ring scan-ring-outer" />
            <div className="scan-ring scan-ring-middle" />
            <div className="scan-ring scan-ring-inner" />

            <div className="scan-corners">
              <span className="corner corner-top-left" />
              <span className="corner corner-top-right" />
              <span className="corner corner-bottom-left" />
              <span className="corner corner-bottom-right" />
            </div>

            <div className="scan-icon">
              <ThemeableIcon />
            </div>
          </div>

          {/* TEXT */}
          <div className="transition-text scan-status">
            SCANNING
          </div>

        </div>
      </div>
    </div>
  );
}

console.log("scan transition rendered");