const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("zendium", {
  system: {
    getInfo: () => ipcRenderer.invoke("system:getInfo"),
  },

  location: {
    getCurrent: () => ipcRenderer.invoke("location:getCurrent"),
  },

  weather: {
    getCurrent: () => ipcRenderer.invoke("weather:getCurrent"),
  },

  news: {
    getWorld: () => ipcRenderer.invoke("news:getWorld"),
    getItaly: () => ipcRenderer.invoke("news:getItaly"),
  },

  terminal: {
    write: (data) => ipcRenderer.send("terminal:write", data),
    onData: (callback) => {
      const listener = (_event, data) => {
        callback(data);
      };

      ipcRenderer.on("terminal:data", listener);

      return () => {
        ipcRenderer.removeListener("terminal:data", listener);
      };
    },
    resize: (cols, rows) => {
      ipcRenderer.send("terminal:resize", { cols, rows });
    },
  },
});
