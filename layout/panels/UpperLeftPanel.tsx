import { useEffect, useState } from "react";
import HudCorners from "./HudCorners";

const TITLE_LINES = [
  "╔══════════════════════════╗",
  "║        SYSTEM INFO       ║",
  "╚══════════════════════════╝",
];

type SystemInfoData = Awaited<ReturnType<typeof window.zendium.system.getInfo>>;

export default function UpperLeftPanel() {
  const [info, setInfo] = useState<SystemInfoData | null>(null);

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

  return (
    <div className="panel panel--upper-left panel--hud">
      <HudCorners />
      <span className="corner corner--tl"></span>
      <span className="corner corner--tr"></span>
      <span className="corner corner--bl"></span>
      <span className="corner corner--br"></span>

      <div className="panel-title glow-text">
        {TITLE_LINES.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div className="panel-text panel-text-medium glow-text--subtle scrollable">
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}
      </div>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("UpperLeftPanel loaded");
}

