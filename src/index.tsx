import React from "react";
import ReactDOM from "react-dom/client";

import "@style/global.css";
import "@style/views/views.css";

import App from "./App";

console.time("React startup");
console.log("index.tsx loaded");

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

console.timeEnd("React startup");
