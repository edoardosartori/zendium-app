import { useState } from "react";
import Boot from "./boot/Boot";
import Dashboard from "./dashboard/Dashboard";

export default function App() {

    const [bootFinished, setBootFinished] = useState(false);

    return bootFinished
        ? <Dashboard />
        : <Boot onFinish={() => setBootFinished(true)} />;

}