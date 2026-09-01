import si from "systeminformation";

const POLL_INTERVAL_MS = 2500;
const INITIAL_DELAY_MS = 24000;

let intervalId = null;
let prevNetSnapshot = null; // { time: number, interfaces: { [iface]: { rx: number, tx: number } } }

async function collectStats() {
  const [cpuLoad, mem, networkInterfaces, networkStats, cpuTemp] =
    await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.networkInterfaces(),
      si.networkStats(),
      si.cpuTemperature(),
    ]);

  const relevantIfaces = new Set(
    networkInterfaces
      .filter((iface) => !iface.internal)
      .map((iface) => iface.iface),
  );

  const now = Date.now();

  const network = networkStats
    .filter((iface) => relevantIfaces.has(iface.iface))
    .map((iface) => {
      let rxBytesPerSec = 0;
      let txBytesPerSec = 0;

      const prevIface = prevNetSnapshot?.interfaces?.[iface.iface];

      if (prevIface) {
        const elapsedSec = (now - prevNetSnapshot.time) / 1000;

        if (elapsedSec > 0) {
          rxBytesPerSec = Math.max(
            0,
            (iface.rx_bytes - prevIface.rx) / elapsedSec,
          );

          txBytesPerSec = Math.max(
            0,
            (iface.tx_bytes - prevIface.tx) / elapsedSec,
          );
        }
      }

      return {
        interface: iface.iface,
        rxBytesPerSec: Math.round(rxBytesPerSec),
        txBytesPerSec: Math.round(txBytesPerSec),
      };
    });

  prevNetSnapshot = {
    time: now,
    interfaces: Object.fromEntries(
      networkStats.map((iface) => [
        iface.iface,
        { rx: iface.rx_bytes, tx: iface.tx_bytes },
      ]),
    ),
  };

  const cpuTemperature =
    typeof cpuTemp.main === "number" && cpuTemp.main >= 0 ? cpuTemp.main : null;

  return {
    cpuLoadPercent: cpuLoad.currentLoad,
    ramUsedBytes: mem.active,
    ramTotalBytes: mem.total,
    cpuTemperature,
    network,
  };
}

export function startSystemStatsPolling(win) {
  stopSystemStatsPolling();

  setTimeout(() => {
    if (win.isDestroyed()) {
      return;
    }

    intervalId = setInterval(async () => {
      if (win.isDestroyed()) {
        stopSystemStatsPolling();
        return;
      }

      try {
        const stats = await collectStats();
        win.webContents.send("system:stats", stats);
      } catch (err) {
        console.error("systemStats: failed to collect stats", err);
      }
    }, POLL_INTERVAL_MS);
  }, INITIAL_DELAY_MS);
}

export function stopSystemStatsPolling() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  prevNetSnapshot = null;
}
