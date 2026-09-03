import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pty from "node-pty";

import { getSystemInfo } from "./system.js";
import { getCurrentLocation } from "./location.js";
import { getLiveData } from "./liveData.js";
import * as fileExplorerLinux from "./fileExplorerLinux.js";
import * as fileExplorerWindows from "./fileExplorerWindows.js";
import {
  startSystemStatsPolling,
  stopSystemStatsPolling,
} from "./systemStats.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

let mainWindow = null;
let terminalProcess = null;
let isQuitting = false;

// --------------------------------------------------
// SYSTEM INFO
ipcMain.handle("system:getInfo", () => {
  return getSystemInfo();
});

// --------------------------------------------------
// SYSTEM STATS CONTROLS (START / STOP)
ipcMain.on("system:startStats", () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    startSystemStatsPolling(mainWindow);
  }
});

ipcMain.on("system:stopStats", () => {
  stopSystemStatsPolling();
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
// LIVE DATA
ipcMain.handle("liveData:getLiveData", async () => {
  return await getLiveData();
});

// --------------------------------------------------
// TERMINAL
ipcMain.on("terminal:write", (_event, data) => {
  if (!terminalProcess) {
    return;
  }
  terminalProcess.write(data);
});

// --------------------------------------------------
// FILEEXPLORER

const fileExplorer =
  process.platform === "win32"
    ? fileExplorerWindows
    : fileExplorerLinux;

ipcMain.handle("terminal:getCwd", () => {
  if (!terminalProcess) {
    return { available: false, error: "NO_TERMINAL" };
  }

  return fileExplorer.getTerminalCwd(terminalProcess.pid);
});

ipcMain.handle("fs:readDir", (_event, dirPath) => {
  return fileExplorer.readDirectory(dirPath);
});

// --------------------------------------------------
// WINDOW
function createWindow() {
  mainWindow = new BrowserWindow({
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
  // REAL TERMINAL

  const shell =
    process.platform === "win32"
      ? "powershell.exe"
      : process.env.SHELL || "/bin/bash";

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
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("terminal:data", data);
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
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    stopSystemStatsPolling();
    mainWindow = null;
  });

  // --------------------------------------------------
  // SYSTEM STATS (CPU/RAM/NETWORK/TEMP LIVE)
  startSystemStatsPolling(mainWindow);

  // --------------------------------------------------
  // LOAD APPLICATION
  if (isDev) {
    console.log("Loading DEV server...");
    mainWindow.loadURL("http://localhost:8080");
    mainWindow.webContents.openDevTools();
  } else {
    //console.log("Loading production build...");
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
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
  stopSystemStatsPolling();
  if (terminalProcess) {
    terminalProcess.kill();
    terminalProcess = null;
  }
});
