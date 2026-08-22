import { useEffect } from "react";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

import "@style/transitions/pulse.css";

type Props = {
  onComplete: () => void;
};

export default function PulseTransition({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="pulse-transition">
      <div className="pulse-transition-inner">
        {/* CENTRAL CORE */}
        <div className="pulse-core">
          <div className="pulse-core-glow" />
          <div className="pulse-ring pulse-ring-outer" />
          <div className="pulse-ring pulse-ring-middle" />
          <div className="pulse-ring pulse-ring-inner" />
          <div className="pulse-core-icon">
            <ThemeableIcon />
          </div>
        </div>

        {/* ENERGY WAVES */}
        <div className="pulse-wave pulse-wave-one" />
        <div className="pulse-wave pulse-wave-two" />
        <div className="pulse-wave pulse-wave-three" />

        {/* ENERGY PARTICLES */}
        <div className="pulse-particles">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="pulse-particle"
              style={{
                animationDelay: `${(index % 8) * 0.15}s`,
              }}
            />
          ))}
        </div>

        {/* STATUS */}
        <div className="pulse-status">
          <div className="pulse-status-label">LOADING ZENDIUM SYSTEM</div>
        </div>
      </div>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("pulse transition rendered");
}
