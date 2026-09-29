import { memo, useCallback, useEffect, useRef, useState } from "react";
import { keyPressSound } from "@core/audio/Audio";
import "@style/layout/keyboard-panel.css";

interface KeyConfig {
  label: string;
  code: string;
  flex?: number;
}

const KEY_ROWS: KeyConfig[][] = [
  [
    { label: "ESC", code: "Escape" },
    { label: "F1", code: "F1" },
    { label: "F2", code: "F2" },
    { label: "F3", code: "F3" },
    { label: "F4", code: "F4" },
    { label: "F5", code: "F5" },
    { label: "F6", code: "F6" },
    { label: "F7", code: "F7" },
    { label: "F8", code: "F8" },
    { label: "F9", code: "F9" },
    { label: "F10", code: "F10" },
    { label: "F11", code: "F11" },
    { label: "F12", code: "F12" },
  ],
  [
    { label: "`", code: "Backquote" },
    { label: "1", code: "Digit1" },
    { label: "2", code: "Digit2" },
    { label: "3", code: "Digit3" },
    { label: "4", code: "Digit4" },
    { label: "5", code: "Digit5" },
    { label: "6", code: "Digit6" },
    { label: "7", code: "Digit7" },
    { label: "8", code: "Digit8" },
    { label: "9", code: "Digit9" },
    { label: "0", code: "Digit0" },
    { label: "-", code: "Minus" },
    { label: "=", code: "Equal" },
    { label: "BKSP", code: "Backspace", flex: 2 },
  ],
  [
    { label: "TAB", code: "Tab", flex: 1.5 },
    { label: "Q", code: "KeyQ" },
    { label: "W", code: "KeyW" },
    { label: "E", code: "KeyE" },
    { label: "R", code: "KeyR" },
    { label: "T", code: "KeyT" },
    { label: "Y", code: "KeyY" },
    { label: "U", code: "KeyU" },
    { label: "I", code: "KeyI" },
    { label: "O", code: "KeyO" },
    { label: "P", code: "KeyP" },
    { label: "[", code: "BracketLeft" },
    { label: "]", code: "BracketRight" },
    { label: "\\", code: "Backslash", flex: 1.2 },
  ],
  [
    { label: "CAPS", code: "CapsLock", flex: 1.8 },
    { label: "A", code: "KeyA" },
    { label: "S", code: "KeyS" },
    { label: "D", code: "KeyD" },
    { label: "F", code: "KeyF" },
    { label: "G", code: "KeyG" },
    { label: "H", code: "KeyH" },
    { label: "J", code: "KeyJ" },
    { label: "K", code: "KeyK" },
    { label: "L", code: "KeyL" },
    { label: ";", code: "Semicolon" },
    { label: "'", code: "Quote" },
    { label: "ENTER", code: "Enter", flex: 2.2 },
  ],
  [
    { label: "SHIFT", code: "ShiftLeft", flex: 2.3 },
    { label: "Z", code: "KeyZ" },
    { label: "X", code: "KeyX" },
    { label: "C", code: "KeyC" },
    { label: "V", code: "KeyV" },
    { label: "B", code: "KeyB" },
    { label: "N", code: "KeyN" },
    { label: "M", code: "KeyM" },
    { label: ",", code: "Comma" },
    { label: ".", code: "Period" },
    { label: "/", code: "Slash" },
    { label: "SHIFT", code: "ShiftRight", flex: 2.8 },
  ],
  [
    { label: "CTRL", code: "ControlLeft", flex: 1.5 },
    { label: "WIN", code: "MetaLeft", flex: 1.2 },
    { label: "ALT", code: "AltLeft", flex: 1.2 },
    { label: "SPACE", code: "Space", flex: 6.5 },
    { label: "ALT", code: "AltRight", flex: 1.2 },
    { label: "WIN", code: "MetaRight", flex: 1.2 },
    { label: "CTRL", code: "ControlRight", flex: 1.5 },
  ],
];

// Non-printable keys -> sequence sent to the terminal
const SPECIAL: Record<string, string> = {
  Enter: "\r",
  Backspace: "\x7f",
  Tab: "\t",
  Escape: "\x1b",
  Space: " ",
};

// code -> [normal, shifted]
const CHARS: Record<string, [string, string]> = {
  Backquote: ["`", "~"],
  Digit1: ["1", "!"],
  Digit2: ["2", "@"],
  Digit3: ["3", "#"],
  Digit4: ["4", "$"],
  Digit5: ["5", "%"],
  Digit6: ["6", "^"],
  Digit7: ["7", "&"],
  Digit8: ["8", "*"],
  Digit9: ["9", "("],
  Digit0: ["0", ")"],
  Minus: ["-", "_"],
  Equal: ["=", "+"],
  BracketLeft: ["[", "{"],
  BracketRight: ["]", "}"],
  Backslash: ["\\", "|"],
  Semicolon: [";", ":"],
  Quote: ["'", '"'],
  Comma: [",", "<"],
  Period: [".", ">"],
  Slash: ["/", "?"],
};
for (const c of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  CHARS[`Key${c}`] = [c.toLowerCase(), c];
}

// Modifiers that behave as toggles on the on-screen keyboard
const LATCHABLE = new Set([
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "CapsLock",
]);

const Key = memo(function Key({
  label,
  code,
  flex,
  active,
  onPress,
  onRelease,
}: {
  label: string;
  code: string;
  flex: number;
  active: boolean;
  onPress: (code: string) => void;
  onRelease: (code: string) => void;
}) {
  return (
    <div
      style={{ flex }}
      className={`keyboard-key ${active ? "keyboard-key--active" : ""}`}
      onMouseDown={(e) => {
        e.preventDefault(); // keep the focus on the terminal
        if (e.button !== 0) return; // left click only
        onPress(code);
      }}
      onMouseUp={() => onRelease(code)}
      onMouseLeave={() => onRelease(code)} // covers dragging the cursor off the key before release
    >
      {label}
    </div>
  );
});

export default function KeyboardPanel() {
  // Keys currently held down (physical keyboard or mouse)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Modifiers currently "armed" via on-screen clicks
  const [latched, setLatched] = useState<Set<string>>(new Set());

  // Ref so pressKey can read the latest value without changing identity (keeps memo effective)
  const latchedRef = useRef(latched);
  latchedRef.current = latched;

  const pressKey = useCallback((code: string) => {
    keyPressSound(0.7);

    // Modifiers: toggle on/off, never write anything
    if (LATCHABLE.has(code)) {
      setLatched((prev) => {
        const next = new Set(prev);
        if (next.has(code)) next.delete(code);
        else next.add(code);
        return next;
      });
      return;
    }

    setPressedKeys((prev) => {
      if (prev.has(code)) return prev;
      const next = new Set(prev);
      next.add(code);
      return next;
    });

    const l = latchedRef.current;
    const shift = l.has("ShiftLeft") || l.has("ShiftRight");
    const ctrl = l.has("ControlLeft") || l.has("ControlRight");
    const alt = l.has("AltLeft") || l.has("AltRight");
    const caps = l.has("CapsLock");

    let data = SPECIAL[code];
    if (data === undefined) {
      const pair = CHARS[code];
      if (!pair) return; // F1-F12, WIN, etc.: no output
      const isLetter = code.startsWith("Key");
      // Caps only affects letters; Shift + Caps cancel each other out
      const useShift = isLetter ? shift !== caps : shift;
      data = pair[useShift ? 1 : 0];
    }

    // Ctrl + letter -> control character (e.g. Ctrl+C = \x03)
    if (ctrl && data.length === 1) {
      const c = data.toUpperCase().charCodeAt(0);
      if (c >= 64 && c <= 95) data = String.fromCharCode(c - 64);
    }

    // Alt -> ESC prefix
    if (alt) data = "\x1b" + data;

    window.zendium.terminal.write(data);

    // Shift/Ctrl/Alt release after use, Caps stays on
    if (shift || ctrl || alt) {
      setLatched((prev) => {
        const next = new Set(prev);
        [
          "ShiftLeft",
          "ShiftRight",
          "ControlLeft",
          "ControlRight",
          "AltLeft",
          "AltRight",
        ].forEach((k) => next.delete(k));
        return next;
      });
    }
  }, []);

  const releaseKey = useCallback((code: string) => {
    setPressedKeys((prev) => {
      if (!prev.has(code)) return prev;
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.repeat) {
        keyPressSound(0.7);
      }

      setPressedKeys((prev) => {
        if (prev.has(event.code)) return prev;
        const next = new Set(prev);
        next.add(event.code);
        return next;
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        if (!prev.has(event.code)) return prev;
        const next = new Set(prev);
        next.delete(event.code);
        return next;
      });
    };

    // Clear all pressed keys when the window loses focus (e.g. Alt+Tab),
    // since the keyup event never arrives in that case
    const handleBlur = () => setPressedKeys(new Set());
    window.addEventListener("blur", handleBlur);

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <div className="panel panel--keyboard">
      <div className="keyboard">
        {KEY_ROWS.map((row, rowIndex) => (
          <div className="keyboard-row" key={rowIndex}>
            {row.map((key) => (
              <Key
                key={key.code}
                code={key.code}
                label={key.label}
                flex={key.flex ?? 1}
                // Stay lit while pressed or latched
                active={pressedKeys.has(key.code) || latched.has(key.code)}
                onPress={pressKey}
                onRelease={releaseKey}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("KeyboardPanel loaded");
}
