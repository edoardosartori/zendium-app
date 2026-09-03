import { useEffect, useRef } from "react";

import ThemeableIcon from "@assets/terminal-themeable-icon.svg?react";

import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

import "@style/views/terminal.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    // --------------------------------------------------
    // THEME
    // --------------------------------------------------

    const getPrimaryColor = () => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim();
    };

    const primaryColor = getPrimaryColor();

    const xterm = new XTerm({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 14,
      theme: {
        background: "#000000",
        foreground: primaryColor,
        cursor: primaryColor,
      },
      scrollback: 5000,
    });

    // --------------------------------------------------
    // THEME OBSERVER
    // --------------------------------------------------

    const themeObserver = new MutationObserver(() => {
      const newPrimaryColor = getPrimaryColor();

      xterm.options.theme = {
        ...xterm.options.theme,
        foreground: newPrimaryColor,
        cursor: newPrimaryColor,
      };
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    // --------------------------------------------------
    // XTERM
    // --------------------------------------------------

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
      themeObserver.disconnect();
      inputDisposable.dispose();
      removeDataListener();
      xterm.dispose();
    };
  }, []);

  return (
    <div className="central-view terminal-view">
      <ThemeableIcon className="terminal-icon terminal-view-icon" />
      <div className="terminal-container terminal-view-container">
        <div ref={terminalRef} className="terminal-instance" />
      </div>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("terminal loaded");
}
