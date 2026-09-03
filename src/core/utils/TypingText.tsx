import { useEffect, useState } from "react";
import { beep } from "@core/audio/Audio";

type Props = {
  text: string;
  speed?: number;
  onComplete?: () => void;
  showCursor?: boolean;
  sound?: boolean;
};

export default function TypingText({
  text,
  speed = 60,
  onComplete,
  showCursor = true,
  sound = true,
}: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("TYPING START:", performance.now());
    }
    
    let i = 0;
    let displayed = "";
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      if (cancelled) return;

      if (i >= text.length) {
        onComplete?.();
        return;
      }

      // pause like {pause:500}
      const pauseMatch = text.slice(i).match(/^\{pause:(\d+)\}/);
      if (pauseMatch) {
        i += pauseMatch[0].length;
        timer = setTimeout(tick, Number(pauseMatch[1]));
        return;
      }

      const char = text[i];
      if (char !== "\n" && sound) beep();

      displayed += char;
      setValue(displayed);
      i++;
      timer = setTimeout(tick, speed);
    }

    tick();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <span style={{ whiteSpace: "pre" }}>
      {value}
      {showCursor && <span className="cursor">█</span>}
    </span>
  );
}
