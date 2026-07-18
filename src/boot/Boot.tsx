import { useState } from "react";

import "./Boot.css";

import BootSequence from "./BootSequence";
import Dashboard from "../dashboard/Dashboard";

console.log("Boot rendered");

export default function Boot() {
    
    const [bootFinished, setBootFinished] = useState(false);

    if (bootFinished) {
        return <Dashboard />;
    }

    return (
        <div className="boot">

            <BootSequence
                onFinish={() => setBootFinished(true)}
            />

        </div>
    );

}
