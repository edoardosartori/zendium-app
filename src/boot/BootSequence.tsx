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

import DashboardTransition from "@views/DashboardTransition";

type Props = {
  onFinish: () => void;
};

export default function BootSequence({ onFinish }: Props) {
  const [step, setStep] = useState(0);
  const event = timeline[step];

  useEffect(() => {
    if (event.type === "dashboard") {
      return;
    }

    if (step >= timeline.length - 1) {
      const timer = setTimeout(() => {
        onFinish();
      }, event.duration);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setStep((prev) => prev + 1);
    }, event.duration);

    return () => clearTimeout(timer);
  }, [step, event, onFinish]);

  switch (event.type) {
    case "logo":
      return <Logo onComplete={() => setStep((prev) => prev + 1)} />;
    case "starting":
      return <Starting onComplete={() => setStep((prev) => prev + 1)} />;
    case "welcome":
      return <Welcome onComplete={() => setStep((prev) => prev + 1)} />;
    case "system-info":
      return <SystemInfo onComplete={() => setStep((prev) => prev + 1)} />;
    case "news":
      return <News onComplete={() => setStep((prev) => prev + 1)} />;
    case "init-terminal":
      return (
        <InitTerminal onComplete={() => setStep((prev) => prev + 1)} />
      );
    case "dashboard":
      return (
        <Dashboard onComplete={() => setStep((prev) => prev + 1)} />
      );

    default:
      return null;
  }
}
