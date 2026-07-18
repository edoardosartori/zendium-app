import { useState } from "react";
import BootSequence from "./boot/BootSequence";
import Dashboard from "./dashboard/Dashboard";

export default function Boot() {

    const [finished, setFinished] = useState(false);

    return finished
        ? <Dashboard />
        : <BootSequence onFinish={() => setFinished(true)} />;
}