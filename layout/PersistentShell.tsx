import { ReactNode } from "react";

import UpperLeftPanel from "./panels/UpperLeftPanel";
import UpperRightPanel from "./panels/UpperRightPanel";
import LowerLeftPanel from "./panels/LowerLeftPanel";
import LowerRightPanel from "./panels/LowerRightPanel";

import ClockPanel from "./panels/ClockPanel";
import ThemePanel from "./panels/ThemePanel";
import KeyboardPanel from "./panels/KeyboardPanel";
import LiveStatsPanel from "./panels/LiveStatsPanel";

import "@style/layout/persistent-shell.css";
import "@style/layout/panels.css";

type Props = {
  children: ReactNode;
  upperLeftVisible?: boolean;
  upperRightVisible?: boolean;
  lowerLeftVisible?: boolean;
  lowerRightVisible?: boolean;
  clockVisible?: boolean;
  themeVisible?: boolean;
  keyboardVisible?: boolean;
  liveStatsVisible?: boolean;
};

export default function PersistentShell({
  children,
  upperLeftVisible = false,
  upperRightVisible = false,
  lowerLeftVisible = false,
  lowerRightVisible = false,
  clockVisible = false,
  themeVisible = false,
  keyboardVisible = false,
  liveStatsVisible = false,
}: Props) {
  return (
    <div className="persistent-shell">
      <div
        className={`persistent-shell-panel persistent-shell-upper-left ${
          upperLeftVisible ? "panel-visible" : ""
        }`}
      >
        <UpperLeftPanel />
      </div>

      <div
        className={`persistent-shell-panel persistent-shell-upper-right ${
          upperRightVisible ? "panel-visible" : ""
        }`}
      >
        <UpperRightPanel />
      </div>

      <div
        className={`persistent-shell-panel persistent-shell-lower-left ${
          lowerLeftVisible ? "panel-visible" : ""
        }`}
      >
        <LowerLeftPanel />
      </div>

      <div
        className={`persistent-shell-panel persistent-shell-lower-right ${
          lowerRightVisible ? "panel-visible" : ""
        }`}
      >
        <LowerRightPanel />
      </div>
      <div
        className={`persistent-shell-panel persistent-shell-clock ${
          clockVisible ? "panel-visible" : ""
        }`}
      >
        <ClockPanel />
      </div>
      <div
        className={`persistent-shell-panel persistent-shell-theme ${
          themeVisible ? "panel-visible" : ""
        }`}
      >
        <ThemePanel />
      </div>
      <div
        className={`persistent-shell-panel persistent-shell-keyboard ${
          keyboardVisible ? "panel-visible" : ""
        }`}
      >
        <KeyboardPanel />
      </div>
      <div
        className={`persistent-shell-panel persistent-shell-livestats ${
          liveStatsVisible ? "panel-visible" : ""
        }`}
      >
        <LiveStatsPanel />
      </div>

      <main className="persistent-shell-center">{children}</main>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("PersistentShell loaded");
}
