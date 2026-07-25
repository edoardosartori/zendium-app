import BootSequence from "./boot/BootSequence";
import PersistentShell from "../layout/PersistentShell";

export default function App() {
  return (
    <PersistentShell>
      <BootSequence />
    </PersistentShell>
  );
}

console.log("App rendered");
