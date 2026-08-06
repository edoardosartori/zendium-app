import { useEffect } from "react";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

import "@style/transitions/orbit.css";

type Props = {
  onComplete: () => void;
};

export default function OrbitTransition({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="orbit-transition">
      <div className="orbit-transition-inner">
        <div className="orbit-system">
          <div className="orbit-ring orbit-ring-outer" />
          <div className="orbit-ring orbit-ring-middle" />
          <div className="orbit-ring orbit-ring-inner" />
          <div className="orbit-body orbit-body-one">
            <span />
          </div>
          <div className="orbit-body orbit-body-two">
            <span />
          </div>
          <div className="orbit-body orbit-body-three">
            <span />
          </div>
          <div className="orbit-core">
            <div className="orbit-core-glow" />
            <ThemeableIcon />
          </div>
        </div>
        <div className="orbit-status">
          <div className="orbit-status-label">RETRIVING DATA</div>
          <div className="orbit-status-substatus">ALIGNING CORE</div>
        </div>
      </div>
    </div>
  );
}

console.log("orbit transition rendered");
