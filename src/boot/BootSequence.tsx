import { useEffect, useRef, useState } from "react";

import { timeline } from "./BootTimeLine";

import Logo from "@views/Logo";
import Welcome from "@views/Welcome";
import Terminal from "@views/Terminal";

import GridTransition from "@transitions/GridTransition";
import PulseTransition from "@transitions/PulseTransition";

import { useCursorVisibility } from "@utils/useCursorVisibility";

// --------------------------------------------------
// PANEL STATE
type PanelState = {
  upperLeft: boolean;
  upperRight: boolean;
  lowerLeft: boolean;
  lowerRight: boolean;
  clock: boolean;
  theme: boolean;
  keyboard: boolean;
  liveStats: boolean;
};

type Props = {
  onPanelsChange: React.Dispatch<React.SetStateAction<PanelState>>;
};

// --------------------------------------------------
// BOOT SEQUENCE
export default function BootSequence({ onPanelsChange }: Props) {
  const [step, setStep] = useState(0);

  const advancingRef = useRef(false);

  const event = timeline[step];

  // Cursor visibility handling (hidden until "terminal")
  useCursorVisibility(event.type === "terminal");

  // --------------------------------------------------
  // PANEL TRIGGERS
  // All panels enter once the Terminal is reached, staggered.
  useEffect(() => {
    if (event.type !== "terminal") {
      return;
    }

    const STAGGER_DELAY = 200;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const schedule = (delay: number, patch: Partial<PanelState>) => {
      const id = setTimeout(() => {
        onPanelsChange((current) => ({
          ...current,
          ...patch,
        }));
      }, delay);

      timeouts.push(id);
    };

    schedule(STAGGER_DELAY * 0, { upperLeft: true });
    schedule(STAGGER_DELAY * 1, { upperRight: true });
    schedule(STAGGER_DELAY * 2, { lowerLeft: true });
    schedule(STAGGER_DELAY * 3, { lowerRight: true });
    schedule(STAGGER_DELAY * 4, { clock: true });
    schedule(STAGGER_DELAY * 4, { theme: true });
    schedule(STAGGER_DELAY * 4, { keyboard: true });
    schedule(STAGGER_DELAY * 4, { liveStats: true });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [event.type, onPanelsChange]);

  // --------------------------------------------------
  // ADVANCE TO NEXT VIEW
  const handleComplete = () => {
    if (advancingRef.current) {
      return;
    }

    if (step >= timeline.length - 1) {
      return;
    }

    advancingRef.current = true;

    setStep((prev) => prev + 1);
  };

  // --------------------------------------------------
  // RESET ADVANCE GUARD
  useEffect(() => {
    advancingRef.current = false;
  }, [step]);

  // --------------------------------------------------
  // SKIP VIEW WITH KEYBOARD / MOUSE
  useEffect(() => {
    // Terminal is the final view.
    if (event.type === "terminal") {
      return;
    }

    const handleKeyDown = () => {
      handleComplete();
    };

    const handleMouseDown = () => {
      handleComplete();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [step, event.type]);

  // --------------------------------------------------
  // CURRENT VIEW
  switch (event.type) {
    case "logo":
      return <Logo onComplete={handleComplete} />;

    case "welcome":
      return <Welcome onComplete={handleComplete} />;

    case "terminal":
      return <Terminal />;

    // --------------------------------------------------
    // TRANSITIONS
    case "grid-transition":
      return <GridTransition onComplete={handleComplete} />;

    case "pulse-transition":
      return <PulseTransition onComplete={handleComplete} />;
    
    default:
      return null;
  }
}
