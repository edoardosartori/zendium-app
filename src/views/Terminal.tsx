import { useEffect, useRef } from "react";

import ThemeableIcon from "@assets/terminal-themeable-icon.svg?react";

import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import "@xterm/xterm/css/xterm.css";

import "@style/views/terminal.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    let isDisposed = false;
    let resizeObserver: ResizeObserver | null = null;

    // --------------------------------------------------
    // THEME SETUP
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

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    // --------------------------------------------------
    // ASYNCHRONOUS INITIALIZATION
    // --------------------------------------------------
    const initTerminal = async () => {
      // 1. Wait for custom fonts to fully load in browser memory
      await document.fonts.ready;
      if (isDisposed || !terminalRef.current) return;

      // 2. Open terminal instance in DOM
      xterm.open(terminalRef.current);

      // 3. Enable WebGL renderer (fixes Windows DPI scaling and line-height issues)
      try {
        const webglAddon = new WebglAddon();
        webglAddon.onContextLoss(() => webglAddon.dispose());
        xterm.loadAddon(webglAddon);
      } catch (e) {
        console.warn(
          "WebGL Addon not supported, falling back to standard renderer",
          e,
        );
      }

      // 4. Safe resize function
      const doResize = () => {
        if (!terminalRef.current || terminalRef.current.clientWidth === 0)
          return;

        try {
          fitAddon.fit();
          if (xterm.cols > 0 && xterm.rows > 0) {
            window.zendium.terminal.resize(xterm.cols, xterm.rows);
          }
        } catch (err) {
          console.error("Error during fitAddon.fit():", err);
        }
      };

      // 5. Trigger resize once scale CSS animation finishes
      const containerEl = terminalRef.current.closest(".terminal-container");
      if (containerEl) {
        containerEl.addEventListener(
          "animationend",
          () => {
            requestAnimationFrame(() => doResize());
          },
          { once: true },
        );
      }

      // 6. Monitor container dimensions
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => doResize());
      });
      resizeObserver.observe(terminalRef.current);

      // Initial fit & focus
      requestAnimationFrame(() => {
        doResize();
        xterm.focus();
      });
    };

    initTerminal();

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
    // DATA BINDING
    // --------------------------------------------------
    const inputDisposable = xterm.onData((data) => {
      window.zendium.terminal.write(data);
    });

    const removeDataListener = window.zendium.terminal.onData((data) => {
      xterm.write(data);
    });

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------
    return () => {
      isDisposed = true;
      if (resizeObserver) resizeObserver.disconnect();
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
