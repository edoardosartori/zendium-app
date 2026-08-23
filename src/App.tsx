import { useState } from "react";

import BootSequence from "./boot/BootSequence";
import PersistentShell from "../layout/PersistentShell";

export type PanelState = {
  upperLeft: boolean;
  upperRight: boolean;
  lowerLeft: boolean;
  lowerRight: boolean;
  clock: boolean;
  theme: boolean;
  keyboard: boolean;
};

export default function App() {
  const [panels, setPanels] = useState<PanelState>({
    upperLeft: false,
    upperRight: false,
    lowerLeft: false,
    lowerRight: false,
    clock: false,
    theme: false,
    keyboard: false,
  });

  return (
    <PersistentShell
      upperLeftVisible={panels.upperLeft}
      upperRightVisible={panels.upperRight}
      lowerLeftVisible={panels.lowerLeft}
      lowerRightVisible={panels.lowerRight}
      clockVisible={panels.clock}
      themeVisible={panels.theme}
      keyboardVisible={panels.keyboard}
    >
      <BootSequence onPanelsChange={setPanels} />
    </PersistentShell>
  );
}

if (import.meta.env.DEV) {
  console.log("App rendered");
}

