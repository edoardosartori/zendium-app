import { useState } from "react";
import BootSequence from "./boot/BootSequence";
import Dashboard from "./dashboard/Dashboard";
import PersistentShell from "../layout/PersistentShell";

export default function App() {
  const [finished, setFinished] = useState(false);

  return (
    <PersistentShell>
      {finished ? (
        <Dashboard />
      ) : (
        <BootSequence onFinish={() => setFinished(true)} />
      )}
    </PersistentShell>
  );
}

console.log("App rendered");
