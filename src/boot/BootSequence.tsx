import { useState } from "react";

import { timeline } from "./BootTimeLine";

import Logo from "@views/Logo";
import Welcome from "@views/Welcome";
import SystemInfo from "@views/SystemInfo";
import News from "@views/News";
import Terminal from "@views/Terminal";

import ScanTransition from "@transitions/ScanTransition";
import DataStreamTransition from "@transitions/DataStreamTransition";
import GridTransition from "@transitions/GridTransition";
import PulseTransition from "@transitions/PulseTransition";
import OrbitTransition from "@transitions/OrbitTransition";
import MatrixRainTransition from "@transitions/MatrixRainTransition";

export default function BootSequence() {
  const [step, setStep] = useState(0);

  const event = timeline[step];

  const handleComplete = () => {
    if (step >= timeline.length - 1) {
      return;
    }

    setStep((prev) => prev + 1);
  };

  switch (event.type) {
    case "logo":
      return <Logo onComplete={handleComplete} />;

    case "welcome":
      return <Welcome onComplete={handleComplete} />;

    case "system-info":
      return <SystemInfo onComplete={handleComplete} />;

    case "news":
      return <News onComplete={handleComplete} />;

    case "terminal":
      return <Terminal />;

    case "scan-transition":
      return <ScanTransition onComplete={handleComplete}  />;

    case "data-stream-transition":
      return <DataStreamTransition onComplete={handleComplete}  />;

    case "grid-transition":
      return <GridTransition onComplete={handleComplete}  />;

    case "pulse-transition":
      return <PulseTransition onComplete={handleComplete}  />;

    case "orbit-transition":
      return <OrbitTransition onComplete={handleComplete}  />;

    case "matrix-rain-transition":
      return <MatrixRainTransition onComplete={handleComplete}  />;
    
    default:
      return null;
  }
}
