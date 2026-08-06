import { useEffect, useRef, useState } from "react";
import TypingText from "@utils/TypingText";

const TITLE_LINES = [
  "╔══════════════════════════╗",
  "║        SYSTEM INFO       ║",
  "╚══════════════════════════╝",
];

type SystemInfoData = Awaited<ReturnType<typeof window.zendium.system.getInfo>>;

export default function UpperLeftPanel() {
  const [info, setInfo] = useState<SystemInfoData | null>(null);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    window.zendium.system.getInfo().then((data) => {
      //console.log("SYSTEM INFO:", data);
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

        // EXTERNAL DISPLAY
        `DISPLAY: ${
          info.externalDisplay ? "EXTERNAL CONNECTED" : "NO EXTERNAL DISPLAY"
        }`,
      ]
    : [];

  const handleLineComplete = () => {
    const isLastLine = currentLine === lines.length - 1;

    if (isLastLine) {
      return;
    }

    setTimeout(() => {
      setCurrentLine((prev) => prev + 1);
    }, 150);
  };

  return (
    <div className="panel panel--upper-left">
      <div className="panel-title">
        {TITLE_LINES.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div className="panel-text">
        {lines.slice(0, currentLine).map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}

        {currentLine < lines.length && (
          <TypingText
            key={currentLine}
            text={lines[currentLine]}
            onComplete={handleLineComplete}
            sound={false}
          />
        )}
      </div>
    </div>
  );
}

console.log("UpperLeftPanel rendered");
