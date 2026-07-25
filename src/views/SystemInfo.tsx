import { useEffect, useState } from "react";
import TypingText from "../core/utils/TypingText";
import ThemableIcon from "@assets/themeable-icon.svg?react";

type SystemInfo = Awaited<ReturnType<typeof window.zendium.system.getInfo>>;

type Props = {
  onComplete: () => void;
};

export default function SystemInfo({ onComplete }: Props) {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    window.zendium.system.getInfo().then((data) => {
      console.log("SYSTEM INFO:", data);
      setInfo(data);
    });
  }, []);

  if (!info) {
    return (
      <div className="text">
        <TypingText text="Loading system information..." />
      </div>
    );
  }

  const lines = [
    `CPU: ${info.cpu}`,
    `CORES: ${info.cpuCores}`,
    `RAM: ${info.ramFree} / ${info.ramTotal}`,
    `ARCH: ${info.architecture}`,
    `KERNEL: ${info.kernel}`,
    `HOSTNAME: ${info.hostname}`,
    `OS: ${info.operatingSystem}`,
  ];

  return (
    <div className="text">
      <div>
        {lines.slice(0, currentLine).map((line, index) => (
          <div key={index}>{line}</div>
        ))}

        {currentLine < lines.length && (
          <TypingText
            text={lines[currentLine]}
            onComplete={() => {
              setTimeout(() => {
                const nextLine = currentLine + 1;
                setCurrentLine(nextLine);

                if (nextLine >= lines.length) {
                  onComplete();
                }
              }, 150);
            }}
          />
        )}
      </div>
    </div>
  );
}

console.log("system info rendered");
