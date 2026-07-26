const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("zendium", {
  system: {
    //--------SYSTEM INFORMATION-------------------//
    getInfo: () => {
      //console.log("PRELOAD: system:getInfo called");
      return ipcRenderer.invoke("system:getInfo");
    }
  },
  //--------LOCATION-------------------//
   location: {
    getCurrent: () => {
      //console.log("PRELOAD: location:getCurrent called");
      return ipcRenderer.invoke("location:getCurrent");
    }
  },
  //--------WEATHER-------------------//
  weather: {
    getCurrent: () => {
      //console.log("PRELOAD: weather:getCurrent called");
      return ipcRenderer.invoke("weather:getCurrent");
    }
  },
  //--------NEWS-------------------//
  news: {
    getLatest: () => {
      //console.log("PRELOAD: news:getLatest called");
      return ipcRenderer.invoke("news:getLatest");
    }
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
  },
});
