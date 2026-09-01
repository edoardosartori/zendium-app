import si from "systeminformation";

const POLL_INTERVAL_MS = 2500;
const INITIAL_DELAY_MS = 24000;

let intervalId = null;
let timeoutId = null;
let prevNetSnapshot = null;
let isFirstRun = true;
let isPollingActive = false;

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

async function runPollingStep(win) {
  if (!isPollingActive || !win || win.isDestroyed()) {
    return;
  }

  try {
    const stats = await collectStats();
    if (isPollingActive && !win.isDestroyed()) {
      win.webContents.send("system:stats", stats);
    }
  } catch (err) {
    console.error("systemStats: failed to collect stats", err);
  }
}

export function startSystemStatsPolling(win) {
  stopSystemStatsPolling();

  isPollingActive = true;
  const delay = isFirstRun ? INITIAL_DELAY_MS : 0;
  isFirstRun = false;

  timeoutId = setTimeout(async () => {
    timeoutId = null;

    if (!isPollingActive) {
      return;
    }

    await runPollingStep(win);

    if (!isPollingActive) {
      return;
    }

    intervalId = setInterval(() => {
      runPollingStep(win);
    }, POLL_INTERVAL_MS);
  }, delay);
}

export function stopSystemStatsPolling() {
  isPollingActive = false;

  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  prevNetSnapshot = null;
}
