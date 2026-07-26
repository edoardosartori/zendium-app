import { useEffect, useState } from "react";
import TypingText from "../core/utils/TypingText";

type SystemInfoData = Awaited<ReturnType<typeof window.zendium.system.getInfo>>;

type Props = {
  onComplete: () => void;
};

export default function Welcome({ onComplete }: Props) {
  const [info, setInfo] = useState<SystemInfoData | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    window.zendium.system.getInfo().then((data) => {
      setInfo(data);
    });
  }, []);

  const now = new Date();

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const handleLogoComplete = () => {
    setTimeout(() => {
      setStep(1);
    }, 500);
  };

  const handleWelcomeComplete = () => {
    setTimeout(() => {
      onComplete();
    }, 800);
  };
  const LOGO = `
 ██╗    ██╗███████╗██╗      ██████╗  ██████╗ ███╗   ███╗███████╗
 ██║    ██║██╔════╝██║     ██╔════╝ ██╔═══██╗████╗ ████║██╔════╝
 ██║ █╗ ██║█████╗  ██║     ██║      ██║   ██║██╔████╔██║█████╗
 ██║███╗██║██╔══╝  ██║     ██║      ██║   ██║██║╚██╔╝██║██╔══╝
 ╚███╔███╔╝███████╗███████╗╚██████╗ ╚██████╔╝██║ ╚═╝ ██║███████╗
  ╚══╝╚══╝ ╚══════╝╚══════╝╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚══════╝`;

  return (
    <div className="central-view">
      {/* LOGO */}

      <div className="display-flex-center welcome-title">
        <TypingText
          speed={10}
          showCursor={false}
          sound={false}
          text={LOGO}
          onComplete={handleLogoComplete}
        />
      </div>

      {/* WELCOME TEXT */}
      <div className="display-flex-center">
        {step >= 1 && (
          <div className="welcome-text">
            <TypingText
              showCursor={false}
              text={`Welcome back,{pause:800} ${info?.username ?? "..."}\n{pause:800} ${date}\n{pause:800} ${time}`}
              onComplete={handleWelcomeComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

console.log("welcome rendered");
