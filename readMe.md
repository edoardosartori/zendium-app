# Zendium

Zendium - Boot & Desktop App (built for Linux/Ubuntu system, with Windows support via PowerShell).

A cyberpunk-style desktop environment and dashboard interface developed with Electron, React, Vite, and TypeScript for system monitoring, file management, and real-time data visualization.

## Main Features

* **System Info:** Real-time hardware monitoring (CPU, RAM, GPU, network, battery via `systeminformation`).

* **Terminal:** Integrated terminal powered by `@xterm/xterm` and `node-pty`.

* **File Explorer:** Local file system navigation.

* **Live Data:** Integrated widgets for weather, news, and dynamic system metrics.

* **Keyboard & Panels:** Interface with status panels.

* **Themes:** 3 built-in color themes.

## Requirements

* **Node.js** (v18 or higher recommended)

* **npm**

## Installation

```
git clone <REPOSITORY_URL>
cd zendium
npm install

```

## Development

Run the application in development mode (Vite + Electron concurrently on `localhost:8080`):

```
npm run dev:electron

```

Alternatively, you can start only the Vite dev server:

```
npm run dev

```

## Build and Distribution

Executable packages are generated using `electron-builder` in the `release/` directory:

* **Linux (AppImage):** Primary target platform.

* **Windows (NSIS Installer):** Supported via PowerShell.

To compile source files and generate the distribution package:

```
npm run dist

```

To compile static assets only with Vite:

```
npm run build

```

**this readMe was made with AI