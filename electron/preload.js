const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("zendium", {
  system: {
    getInfo: () => ipcRenderer.invoke("system:getInfo")
  },
});
