import { app, BrowserWindow } from "electron";

function createWindow() {

    const win = new BrowserWindow({

        width: 1600,
        height: 900,

        frame: false,

        autoHideMenuBar: true,

        backgroundColor: "#000",

        webPreferences: {
            contextIsolation: true
        }

    });

    win.loadURL("http://localhost:8080");

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {

    app.quit();

});