import { useEffect, useState } from "react";

function formatTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatUptime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(
    2,
    "0",
  );
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0",
  );
  return `${days}d${hours}:${minutes}`;
}

export default function ClockPanel() {
  const [now, setNow] = useState(new Date());
  const [uptimeSeconds, setUptimeSeconds] = useState<number | null>(null);

 
  useEffect(() => {
    window.zendium.system.getInfo().then((data) => {
      //console.log("SYSTEM INFO:", data);
      setUptimeSeconds(data.uptimeSeconds);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      setUptimeSeconds((prev) => (prev !== null ? prev + 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel panel--clock">
      <div className="clock-time">{formatTime(now)}</div>
      <div className="clock-uptime">
        UPTIME {uptimeSeconds !== null ? formatUptime(uptimeSeconds) : "--"}
      </div>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("ClockPanel loaded");
}
