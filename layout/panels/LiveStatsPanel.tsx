import { useEffect, useRef, useState } from "react";
import "@style/layout/livestats-panel.css";

const HISTORY_LENGTH = 30;

const SPARK_CHARS = "▁▂▃▄▅▆▇█";

function sparkline(values: number[]): string {
  if (values.length === 0) {
    return "";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value) => {
      const normalized = (value - min) / range;
      const index = Math.min(
        SPARK_CHARS.length - 1,
        Math.floor(normalized * (SPARK_CHARS.length - 1)),
      );
      return SPARK_CHARS[index];
    })
    .join("");
}

function formatBytesPerSec(bytesPerSec: number): string {
  if (bytesPerSec >= 1024 * 1024) {
    return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
  }
  return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
}

export default function LiveStatsPanel() {
  const [cpuLoad, setCpuLoad] = useState<number | null>(null);
  const [ramUsedBytes, setRamUsedBytes] = useState<number | null>(null);
  const [ramTotalBytes, setRamTotalBytes] = useState<number | null>(null);
  const [cpuTemperature, setCpuTemperature] = useState<number | null>(null);
  const [network, setNetwork] = useState<
    { interface: string; rxBytesPerSec: number; txBytesPerSec: number }[]
  >([]);

  const cpuHistoryRef = useRef<number[]>([]);
  const ramHistoryRef = useRef<number[]>([]);
  const netHistoryRef = useRef<number[]>([]);

  const [, forceRerender] = useState(0);

  useEffect(() => {
    const unsubscribe = window.zendium.system.onStats((data) => {
      setCpuLoad(data.cpuLoadPercent);
      setRamUsedBytes(data.ramUsedBytes);
      setRamTotalBytes(data.ramTotalBytes);
      setCpuTemperature(data.cpuTemperature);
      setNetwork(data.network);

      cpuHistoryRef.current = [
        ...cpuHistoryRef.current,
        data.cpuLoadPercent,
      ].slice(-HISTORY_LENGTH);

      const ramPercent = (data.ramUsedBytes / data.ramTotalBytes) * 100;
      ramHistoryRef.current = [...ramHistoryRef.current, ramPercent].slice(
        -HISTORY_LENGTH,
      );

      const totalNetBytesPerSec = data.network.reduce(
        (sum, iface) => sum + iface.rxBytesPerSec + iface.txBytesPerSec,
        0,
      );
      netHistoryRef.current = [
        ...netHistoryRef.current,
        totalNetBytesPerSec,
      ].slice(-HISTORY_LENGTH);

      forceRerender((tick) => tick + 1);
    });

    return () => unsubscribe();
  }, []);

  const hasData =
    cpuLoad !== null && ramUsedBytes !== null && ramTotalBytes !== null;

  const lines = hasData
    ? [
        `CPU TEMP: ${cpuTemperature !== null ? `${cpuTemperature.toFixed(1)}°C` : "N/A"}`,
        `CPU LOAD: ${cpuLoad.toFixed(1)}%  ${sparkline(cpuHistoryRef.current)}`,
        `RAM: ${(ramUsedBytes! / 1e9).toFixed(1)} / ${(
          ramTotalBytes! / 1e9
        ).toFixed(1)} GB  ${sparkline(ramHistoryRef.current)}`,
        `NETWORK: ${sparkline(netHistoryRef.current)}`,
        ...network.map(
          (iface) =>
            `  ${iface.interface} ↓ ${formatBytesPerSec(
              iface.rxBytesPerSec,
            )} ↑ ${formatBytesPerSec(iface.txBytesPerSec)}`,
        ),
      ]
    : ["Loading live stats..."];

  return (
    <div className="panel panel--livestats">
      <div className="panel-text panel-text-medium glow-text--subtle">
        {lines.map((line, index) => (
          <div className="livestats-row" key={`${line}-${index}`}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("LiveStatsPanel rendered");
}
