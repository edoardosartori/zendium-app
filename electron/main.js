import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pty from "node-pty";

import { getSystemInfo } from "./system.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

let terminalProcess = null;
let isQuitting = false;

// --------------------------------------------------
// SYSTEM INFO
// --------------------------------------------------

ipcMain.handle("system:getInfo", () => {
  return getSystemInfo();
});

// --------------------------------------------------
// TERMINAL
// --------------------------------------------------

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
// --------------------------------------------------

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
  // --------------------------------------------------

  const shell = "/bin/bash";

  terminalProcess = pty.spawn(
    shell,
    ["--rcfile", path.join(__dirname, "../scripts/zendium-bashrc")],
    {
      name: "xterm-256color",
      cols: 80,
      rows: 24,
      cwd: process.env.HOME || process.cwd(),
      env: {
        ...process.env,
        TERM: "xterm-256color",
      },
    },
  );

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
  // --------------------------------------------------

  win.once("ready-to-show", () => {
    win.show();
  });

  // --------------------------------------------------
  // LOAD APPLICATION
  // --------------------------------------------------

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
// --------------------------------------------------

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
