import { useState } from "react";

import BootSequence from "./boot/BootSequence";
import PersistentShell from "../layout/PersistentShell";

export type PanelState = {
  upperLeft: boolean;
  upperRight: boolean;
  lowerLeft: boolean;
  lowerRight: boolean;
};

export default function App() {
  const [panels, setPanels] = useState<PanelState>({
    upperLeft: false,
    upperRight: false,
    lowerLeft: false,
    lowerRight: false,
  });

  return (
    <PersistentShell
      upperLeftVisible={panels.upperLeft}
      upperRightVisible={panels.upperRight}
      lowerLeftVisible={panels.lowerLeft}
      lowerRightVisible={panels.lowerRight}
    >
      <BootSequence onPanelsChange={setPanels} />
    </PersistentShell>
  );
}

console.log("App rendered");
