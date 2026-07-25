import { useEffect, useState } from "react";

import { timeline } from "./BootTimeLine";
//import TerminalBoot from "./TerminalBoot";

import Logo from "@views/Logo";
import Starting from "@views/Starting";
import Welcome from "@views/Welcome";
import SystemInfo from "@views/SystemInfo";
import News from "@views/News";
import InitTerminal from "@views/InitTerminal";
import Dashboard from "@views/Dashboard";
import Transition from "@views/Transition";

type Props = {
  onFinish: () => void;
};

export default function BootSequence({ onFinish }: Props) {
  const [step, setStep] = useState(0);
  const event = timeline[step];
  const handleComplete = () => {
    if (step >= timeline.length - 1) {
      onFinish();
      return;
    }
    setStep((prev) => prev + 1);
  };

  switch (event.type) {
    case "logo":
      return <Logo onComplete={handleComplete} />;

    case "starting":
      return <Starting onComplete={handleComplete} />;

    case "welcome":
      return <Welcome onComplete={handleComplete} />;

    case "system-info":
      return <SystemInfo onComplete={handleComplete} />;

    case "news":
      return <News onComplete={handleComplete} />;

    case "init-terminal":
      return <InitTerminal onComplete={handleComplete} />;

    case "dashboard":
      return <Dashboard onComplete={handleComplete} />;

    default:
      return null;
  }
}
