import os from "node:os";
import si from "systeminformation";

export async function getSystemInfo() {
  const [graphics, disks, networkInterfaces, battery] = await Promise.all([
    si.graphics(),
    si.diskLayout(),
    si.networkInterfaces(),
    si.battery(),
  ]);

  const cpus = os.cpus();
  const totalRam = os.totalmem();
  const freeRam = os.freemem();
  const userInfo = os.userInfo();

  return {
    // ---------------------------------------------
    // USER
    // ---------------------------------------------

    username: userInfo.username,

    // ---------------------------------------------
    // CPU
    // ---------------------------------------------

    cpu: cpus[0]?.model ?? "Unknown CPU",
    cpuCores: cpus.length,

    // ---------------------------------------------
    // MEMORY
    // ---------------------------------------------

    ramTotal: `${(totalRam / 1024 / 1024 / 1024).toFixed(1)} GB`,
    ramFree: `${(freeRam / 1024 / 1024 / 1024).toFixed(1)} GB`,

    // ---------------------------------------------
    // SYSTEM
    // ---------------------------------------------

    architecture: os.arch(),
    kernel: os.release(),
    hostname: os.hostname(),
    platform: os.platform(),
    operatingSystem: `${os.type()} ${os.release()}`,

    // ---------------------------------------------
    // GPU
    // ---------------------------------------------

    gpu:
      graphics.controllers.map((gpu) => gpu.model).join(", ") || "Unknown GPU",

    // ---------------------------------------------
    // STORAGE
    // ---------------------------------------------

    storage: disks.map((disk) => ({
      name: disk.name || disk.device || "Unknown",
      size: disk.size
        ? `${(disk.size / 1024 / 1024 / 1024).toFixed(1)} GB`
        : "Unknown",
      type: disk.type || "Unknown",
    })),

    // ---------------------------------------------
    // NETWORK
    // ---------------------------------------------

    network: networkInterfaces
      .filter((network) => !network.internal)
      .map((network) => ({
        interface: network.iface,
        ip: network.ip4 || network.ip6 || "Unknown",
        mac: network.mac || "Unknown",
      })),

    // ---------------------------------------------
    // BATTERY
    // ---------------------------------------------

    battery: battery.hasBattery
      ? {
          percent: battery.percent,
          charging: battery.isCharging,
          acConnected: battery.acConnected,
          timeRemaining: battery.timeRemaining,
        }
      : null,
  };
}
