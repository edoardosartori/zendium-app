import TypingText from "../core/utils/TypingText";

import { useEffect, useState } from "react";

type SystemInfo = Awaited<ReturnType<typeof window.zendium.system.getInfo>>;

export default function DashboardTransition() {
  const [info, setInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    window.zendium.system.getInfo().then((data) => {
      console.log("SYSTEM INFO:", data);
      setInfo(data);
    });
  }, []);

  return (
    <div className="text">
      {info ? (
        <div>
          <div>CPU: {info.cpu}</div>
          <div>CORES: {info.cpuCores}</div>
          <div>RAM: {info.ramFree} / {info.ramTotal}</div>
          <div>ARCH: {info.architecture}</div>
          <div>KERNEL: {info.kernel}</div>
          <div>HOST: {info.hostname}</div>
          <div>OS: {info.operatingSystem}</div>
        </div>
      ) : (
        "Loading system information..."
      )}
    </div>
  );
}

console.log("dashboard transition rendered");
