import { useEffect, useRef, useState } from "react";
import TypingText from "../core/utils/TypingText";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

type SystemInfoData = Awaited<ReturnType<typeof window.zendium.system.getInfo>>;

type Props = {
  onComplete: () => void;
};

export default function SystemInfo({ onComplete }: Props) {
  const [info, setInfo] = useState<SystemInfoData | null>(null);
  const [currentLine, setCurrentLine] = useState(0);

  const completionStarted = useRef(false);

  useEffect(() => {
    window.zendium.system.getInfo().then((data) => {
      console.log("SYSTEM INFO:", data);
      setInfo(data);
    });
  }, []);

  const lines = info
    ? [
        `HOSTNAME: ${info.hostname}`,
        `OS: ${info.operatingSystem}`,
        `CPU: ${info.cpu}`,
        `CORES: ${info.cpuCores}`,
        `RAM: ${info.ramFree} free / ${info.ramTotal} total`,
        `ARCH: ${info.architecture}`,
        `KERNEL: ${info.kernel}`,
      ]
    : [];

  const handleLineComplete = () => {
    const isLastLine = currentLine === lines.length - 1;

    if (isLastLine) {
      if (completionStarted.current) {
        return;
      }

      completionStarted.current = true;

      setTimeout(() => {
        onComplete();
      }, 3000);

      return;
    }

    setTimeout(() => {
      setCurrentLine((prev) => prev + 1);
    }, 150);
  };

  return (
    <div className="text">
      <div>
        <ThemeableIcon className="icon" />
      </div>

      <div>
        {lines.slice(0, currentLine).map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}

        {currentLine < lines.length && (
          <TypingText
            key={currentLine}
            text={lines[currentLine]}
            onComplete={handleLineComplete}
          />
        )}
      </div>
    </div>
  );
}

console.log("system info rendered");
