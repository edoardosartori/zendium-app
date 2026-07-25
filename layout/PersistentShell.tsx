import { ReactNode } from "react";
import UpperLeftPanel from "./panels/UpperLeftPanel";
import UpperRightPanel from "./panels/UpperRightPanel";
import LowerLeftPanel from "./panels/LowerLeftPanel";
import LowerRightPanel from "./panels/LowerRightPanel";

type Props = {
  children: ReactNode;
};

export default function PersistentShell({ children }: Props) {
  return (
    <div className="persistent-shell">
      <div className="persistent-shell-panel persistent-shell-upper-left">
        <UpperLeftPanel />
      </div>
      <div className="persistent-shell-panel persistent-shell-upper-right">
        <UpperRightPanel />
      </div>
      <div className="persistent-shell-panel persistent-shell-lower-left">
        <LowerLeftPanel />
      </div>
      <div className="persistent-shell-panel persistent-shell-lower-right">
        <LowerRightPanel />
      </div>
      <main className="persistent-shell-center">{children}</main>
    </div>
  );
}
