/* import { useEffect, useState } from "react";
import TypingText from "../core/utils/TypingText";

type Props = {
  onComplete: () => void;
};

const lines = [
  "Initializing kernel........OK",
  "Mounting filesystem........OK",
  "Loading drivers........OK",
  "Detecting hardware........OK",
];

export default function TerminalBoot({ onComplete }: Props) {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) {
      onComplete();
    }
  }, [currentLine, onComplete]);

  if (currentLine >= lines.length) {
    return null;
  }

  return (
    <div className="text">
      <div>
        {lines.slice(0, currentLine).map((line, index) => (
          <div key={index}>{line}</div>
        ))}

        <TypingText
          text={lines[currentLine]}
          onComplete={() => {
            setTimeout(() => {
              setCurrentLine((prev) => prev + 1);
            }, 250);
          }}
        />
      </div>
    </div>
  );
}
 */