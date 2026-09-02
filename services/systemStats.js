import si from "systeminformation";

const POLL_INTERVAL_MS = 2500;
const INITIAL_DELAY_MS = 30000;
const TEMPERATURE_INTERVAL_MS = 30000;

let timeoutId = null;
let prevNetSnapshot = null;
let relevantIfaces = null;

let cachedCpuTemperature = null;
let lastTemperatureUpdate = 0;

async function collectStats() {
  const now = Date.now();

  const [cpuLoad, mem, networkStats] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.networkStats(),
  ]);

  // Read CPU temperature only every 30 seconds
  if (now - lastTemperatureUpdate >= TEMPERATURE_INTERVAL_MS) {
    try {
      const cpuTemp = await si.cpuTemperature();

      cachedCpuTemperature =
        typeof cpuTemp.main === "number" && cpuTemp.main >= 0
          ? cpuTemp.main
          : null;

      lastTemperatureUpdate = now;
    } catch (err) {
      console.error("systemStats: failed to read CPU temperature", err);
    }
  }

  const network = networkStats
    .filter((iface) => relevantIfaces?.has(iface.iface))
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
        {
          rx: iface.rx_bytes,
          tx: iface.tx_bytes,
        },
      ]),
    ),
  };

  return {
    cpuLoadPercent: cpuLoad.currentLoad,
    ramUsedBytes: mem.active,
    ramTotalBytes: mem.total,
    cpuTemperature: cachedCpuTemperature,
    network,
  };
}

export function startSystemStatsPolling(win) {
  stopSystemStatsPolling();

  setTimeout(async () => {
    if (win.isDestroyed()) {
      return;
    }

    try {
      // Network interfaces rarely change, so read them only once.
      const networkInterfaces = await si.networkInterfaces();

      relevantIfaces = new Set(
        networkInterfaces
          .filter((iface) => !iface.internal)
          .map((iface) => iface.iface),
      );

      // Start temperature timing from the first collection.
      lastTemperatureUpdate = 0;

      const poll = async () => {
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

        if (!win.isDestroyed()) {
          timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
        }
      };

      await poll();
    } catch (err) {
      console.error(
        "systemStats: failed to initialize network interfaces",
        err,
      );
    }
  }, INITIAL_DELAY_MS);
}

export function stopSystemStatsPolling() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  prevNetSnapshot = null;
  relevantIfaces = null;
  cachedCpuTemperature = null;
  lastTemperatureUpdate = 0;
}
