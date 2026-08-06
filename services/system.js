import os from "node:os";
import si from "systeminformation";

export async function getSystemInfo() {
  const [graphics, filesystems, networkInterfaces, battery] = await Promise.all(
    [si.graphics(), si.fsSize(), si.networkInterfaces(), si.battery()],
  );

  const cpus = os.cpus();
  const totalRam = os.totalmem();
  const freeRam = os.freemem();

  return {
    uptimeSeconds: os.uptime(),
    cpu: cpus[0]?.model ?? "Unknown CPU",
    cpuCores: cpus.length,
    username: os.userInfo().username,
    ramTotal: `${(totalRam / 1024 / 1024 / 1024).toFixed(1)} GB`,
    ramFree: `${(freeRam / 1024 / 1024 / 1024).toFixed(1)} GB`,
    architecture: os.arch(),
    kernel: os.release(),
    hostname: os.hostname(),
    platform: os.platform(),
    operatingSystem: `${os.type()} ${os.release()}`,
    gpu:
      graphics.controllers.map((gpu) => gpu.model).join(", ") || "Unknown GPU",
    storage: filesystems
      .filter((filesystem) => filesystem.mount === "/")
      .map((filesystem) => ({
        mount: filesystem.mount,
        total: `${(filesystem.size / 1024 / 1024 / 1024).toFixed(1)} GB`,
        used: `${(filesystem.used / 1024 / 1024 / 1024).toFixed(1)} GB`,
        available: `${(
          (filesystem.size - filesystem.used) /
          1024 /
          1024 /
          1024
        ).toFixed(1)} GB`,
        usedPercent: `${filesystem.use.toFixed(1)}%`,
      })),
    externalDisplay: graphics.displays.some(
      (display) => display.builtin === false,
    ),
    network: networkInterfaces
      .filter((network) => !network.internal)
      .map((network) => ({
        interface: network.iface,
        ip: network.ip4 || network.ip6 || "Unknown",
        mac: network.mac || "Unknown",
      })),

    battery: battery.hasBattery
      ? {
          percent: battery.percent,
          charging: battery.isCharging,
        }
      : null,
  };
}
