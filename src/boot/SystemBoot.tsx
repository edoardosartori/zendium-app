import { useEffect, useState } from "react";
import TerminalBoot from "./TerminalBoot";

type SystemInfo = Awaited<ReturnType<typeof window.zendium.system.getInfo>>;

type Props = {
  onComplete: () => void;
};

export default function SystemBoot({ onComplete }: Props) {
  const [lines, setLines] = useState<string[] | null>(null);

  useEffect(() => {
    window.zendium.system.getInfo().then((info: SystemInfo) => {
      console.log("SYSTEM BOOT INFO:", info);

      setLines([
        "Initializing kernel...",
        `CPU: ${info.cpu}`,
        `Cores: ${info.cpuCores}`,
        `Memory: ${info.ramFree} free / ${info.ramTotal} total`,
        `Architecture: ${info.architecture}`,
        `Kernel: ${info.kernel}`,
        `Host: ${info.hostname}`,
        `OS: ${info.operatingSystem}`,
      ]);
    });
  }, []);

  if (!lines) {
    return (
      <div className="text">
        Reading system information...
      </div>
    );
  }

  return <TerminalBoot lines={lines} onComplete={onComplete} />;
}
