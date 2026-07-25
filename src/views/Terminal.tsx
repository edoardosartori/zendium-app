import { useEffect, useRef } from "react";

import ThemeableIcon from "@assets/themeable-icon.svg?react";

import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    const xterm = new XTerm({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 14,
      theme: {
        background: "#000000",
        foreground: "#55ff55",
        cursor: "#55ff55",
      },
      scrollback: 5000,
    });
    
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminalRef.current);
    fitAddon.fit();
    requestAnimationFrame(() => {
      xterm.focus();
    });

    // --------------------------------------------------
    // INPUT → BASH
    // --------------------------------------------------

    const inputDisposable = xterm.onData((data) => {
      window.zendium.terminal.write(data);
    });

    // --------------------------------------------------
    // BASH → TERMINAL
    // --------------------------------------------------

    const removeDataListener = window.zendium.terminal.onData((data) => {
      xterm.write(data);
    });

    // --------------------------------------------------
    // RESIZE
    // --------------------------------------------------

    const resizeTerminal = () => {
      fitAddon.fit();
      window.zendium.terminal.resize(xterm.cols, xterm.rows);
    };

    window.addEventListener("resize", resizeTerminal);

    resizeTerminal();

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------

    return () => {
      window.removeEventListener("resize", resizeTerminal);
      inputDisposable.dispose();
      removeDataListener();
      xterm.dispose();
    };
  }, []);

  return (
    <div className="terminal-view">
      <ThemeableIcon className="terminal-icon" />
      <div className="terminal-container">
        <div ref={terminalRef} className="terminal-instance" />
      </div>
    </div>
  );
}

console.log("terminal rendered");
