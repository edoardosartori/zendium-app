import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pty from "node-pty";

import { getSystemInfo } from "./system.js";

import { getCurrentLocation } from "./location.js";
import { getCurrentWeather } from "./weather.js";
import { getLatestNews } from "./news.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

let terminalProcess = null;
let isQuitting = false;

// --------------------------------------------------
// SYSTEM INFO
ipcMain.handle("system:getInfo", () => {
  return getSystemInfo();
});

/* // --------------------------------------------------
// LOCATION
ipcMain.handle("location:getCurrent", async () => {
  console.log("MAIN: LOCATION IPC CALLED");
  return getCurrentLocation();
});
 */
// --------------------------------------------------
// WEATHER
ipcMain.handle("weather:getCurrent", async () => {
  //console.log("MAIN: weather:getCurrent called");
  const location = await getCurrentLocation();
  if (!location.available) {
    console.error("MAIN: location unavailable", location);
    return {
      available: false,
      error: "LOCATION_UNAVAILABLE",
    };
  }
  const weather = await getCurrentWeather(location);
  //console.log("MAIN: weather result:", weather);
  return weather;
});

// --------------------------------------------------
// NEWS
ipcMain.handle("news:getLatest", async () => {
  //console.log("MAIN: news:getLatest called");

  const result = await getLatestNews();

  //console.log("MAIN: news result:", result);

  return result;
});

// --------------------------------------------------
// TERMINAL
ipcMain.on("terminal:write", (_event, data) => {
  if (!terminalProcess) {
    return;
  }
  terminalProcess.write(data);
});

ipcMain.on("terminal:resize", (_event, { cols, rows }) => {
  if (!terminalProcess) {
    return;
  }
  if (cols > 0 && rows > 0) {
    terminalProcess.resize(cols, rows);
  }
});

// --------------------------------------------------
// WINDOW
function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    kiosk: false,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: "#000",
    show: false,
    icon: path.join(__dirname, "../assets/logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // --------------------------------------------------
  // REAL BASH TERMINAL
  const shell = process.env.SHELL || "/bin/bash";

  terminalProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.env.HOME || process.cwd(),
    env: {
      ...process.env,
      TERM: "xterm-256color",
    },
  });

  terminalProcess.onData((data) => {
    if (!win.isDestroyed()) {
      win.webContents.send("terminal:data", data);
    }
  });

  terminalProcess.onExit(() => {
    terminalProcess = null;
    if (!isQuitting) {
      app.quit();
    }
  });

  // --------------------------------------------------
  // WINDOW EVENTS
  win.once("ready-to-show", () => {
    win.show();
  });

  // --------------------------------------------------
  // LOAD APPLICATION
  if (isDev) {
    console.log("Loading DEV server...");
    win.loadURL("http://localhost:8080");
    win.webContents.openDevTools();
  } else {
    console.log("Loading production build...");
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

// --------------------------------------------------
// ELECTRON LIFECYCLE
app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  isQuitting = true;
  if (terminalProcess) {
    terminalProcess.kill();
    terminalProcess = null;
  }
});
