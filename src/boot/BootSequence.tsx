import { useEffect, useRef, useState } from "react";

import { timeline } from "./BootTimeLine";

import Logo from "@views/Logo";
import Welcome from "@views/Welcome";
import Terminal from "@views/Terminal";

import ScanTransition from "@transitions/ScanTransition";
import DataStreamTransition from "@transitions/DataStreamTransition";
import GridTransition from "@transitions/GridTransition";
import PulseTransition from "@transitions/PulseTransition";
import OrbitTransition from "@transitions/OrbitTransition";
import MatrixRainTransition from "@transitions/MatrixRainTransition";

// --------------------------------------------------
// PANEL STATE
type PanelState = {
  upperLeft: boolean;
  upperRight: boolean;
  lowerLeft: boolean;
  lowerRight: boolean;
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

  // --------------------------------------------------
  // PANEL TRIGGERS
  useEffect(() => {
    // ----------------------------------------------
    // UPPER LEFT
    // Enters when Welcome is reached.
    // ----------------------------------------------
    if (event.type === "welcome") {
      onPanelsChange((current) => ({
        ...current,
        upperLeft: true,
      }));
    }

    // ----------------------------------------------
    // UPPER RIGHT
    // Enters on the Matrix Rain transition
    if (
      event.type === "matrix-rain-transition"
    ) {
      onPanelsChange((current) => ({
        ...current,
        upperRight: true,
      }));
    }

    // ----------------------------------------------
    // LOWER LEFT + LOWER RIGHT
    // Both enter when Terminal is reached.
    if (event.type === "terminal") {
      onPanelsChange((current) => ({
        ...current,
        lowerLeft: true,
        lowerRight: true,
      }));
    }
  }, [event.type, step, onPanelsChange]);

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
    case "scan-transition":
      return <ScanTransition onComplete={handleComplete} />;

    case "data-stream-transition":
      return <DataStreamTransition onComplete={handleComplete} />;

    case "grid-transition":
      return <GridTransition onComplete={handleComplete} />;

    case "pulse-transition":
      return <PulseTransition onComplete={handleComplete} />;

    case "orbit-transition":
      return <OrbitTransition onComplete={handleComplete} />;

    case "matrix-rain-transition":
      return <MatrixRainTransition onComplete={handleComplete} />;

    default:
      return null;
  }
}
