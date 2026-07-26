import { useEffect, useState } from "react";
import BootSequence from "./boot/BootSequence";
import PersistentShell from "../layout/PersistentShell";

export default function App() {
  const [panelsVisible, setPanelsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPanelsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PersistentShell panelsVisible={panelsVisible}>
      <BootSequence />
    </PersistentShell>
  );
}

console.log("App rendered");
