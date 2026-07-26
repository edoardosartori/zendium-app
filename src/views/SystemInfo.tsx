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
        // SYSTEM
        `HOSTNAME: ${info.hostname}`,
        `OS: ${info.operatingSystem}`,
        `CPU: ${info.cpu}`,
        `CORES: ${info.cpuCores}`,
        `RAM: ${info.ramFree} free / ${info.ramTotal} total`,
        `ARCH: ${info.architecture}`,
        `KERNEL: ${info.kernel}`,
        `GPU: ${info.gpu}`,

        // BATTERY
        `BATTERY: ${
          info.battery
            ? `${info.battery.percent}% | ${
                info.battery.acConnected ? "AC POWER" : "ON BATTERY"
              }`
            : "NOT AVAILABLE"
        }`,

        // NETWORK
        ...info.network.map(
          (network) => `NETWORK: ${network.interface} | Wi-Fi | ${network.ip}`,
        ),

        // STORAGE
        ...info.storage.map(
          (storage) =>
            `STORAGE: ${storage.used} / ${storage.total} | ${storage.usedPercent} USED`,
        ),

        // ExternalDISPLAY
        `DISPLAY: ${
          info.externalDisplay ? "EXTERNAL CONNECTED" : "NO EXTERNAL DISPLAY"
        }`,
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
      {" "}
      <div>
        {" "}
        <ThemeableIcon className="icon" />{" "}
      </div>
      <div className="system-text">
        <div>SYSTEM INFO:</div>
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
