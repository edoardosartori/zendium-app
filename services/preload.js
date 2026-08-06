const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("zendium", {
  //--------SYSTEM INFORMATION-------------------//
  system: {
    getInfo: () => {
      //console.log("PRELOAD: system:getInfo called");
      return ipcRenderer.invoke("system:getInfo");
    },
  },

  //--------LOCATION-------------------//
  location: {
    getCurrent: () => {
      //console.log("PRELOAD: location:getCurrent called");
      return ipcRenderer.invoke("location:getCurrent");
    },
  },

  //--------LIVE DATA-------------------//
  liveData: {
    getLiveData: () => {
      //console.log("PRELOAD: liveData:getLiveData called");
      return ipcRenderer.invoke("liveData:getLiveData");
    },
  },

  //--------TERMINAL-------------------//
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

    getCwd: () => {
      return ipcRenderer.invoke("terminal:getCwd");
    },
  },

  //--------FILEEXPLORER-------------------//
  fileExplorer: {
    readDir: (dirPath) => {
      return ipcRenderer.invoke("fs:readDir", dirPath);
    },
  },
});
