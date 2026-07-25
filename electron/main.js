import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

ipcMain.handle("system:getInfo", () => {
  const totalRam = os.totalmem();
  const freeRam = os.freemem();

  return {
    cpu: os.cpus()[0]?.model ?? "Unknown CPU",
    cpuCores: os.cpus().length,
    ramTotal: `${(totalRam / 1024 / 1024 / 1024).toFixed(1)} GB`,
    ramFree: `${(freeRam / 1024 / 1024 / 1024).toFixed(1)} GB`,
    architecture: os.arch(),
    kernel: os.release(),
    hostname: os.hostname(),
    platform: os.platform(),
    operatingSystem: `${os.type()} ${os.release()}`,
  };
});

console.time("Electron");

function createWindow() {
  console.timeLog("Electron", "createWindow");

  const win = new BrowserWindow({
    fullscreen: true,
    kiosk: false,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: "#000",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.once("ready-to-show", () => {
    console.timeLog("Electron", "ready-to-show");
    win.show();
  });

  win.webContents.on("did-start-loading", () => {
    console.timeLog("Electron", "did-start-loading");
  });

  win.webContents.on("dom-ready", () => {
    console.timeLog("Electron", "dom-ready");
  });

  win.webContents.on("did-finish-load", () => {
    console.timeLog("Electron", "did-finish-load");
  });

  win.webContents.on("did-stop-loading", () => {
    console.timeEnd("Electron");
  });

  if (isDev) {
    console.log("Loading DEV server...");
    win.loadURL("http://localhost:8080");
  } else {
    console.log("Loading production build...");
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  console.timeLog("Electron", "app ready");
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
