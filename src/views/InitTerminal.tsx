import { useEffect } from "react";
import TypingText from "../core/utils/TypingText";

type Props = {
  onComplete: () => void;
};

export default function Init({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text">
      <TypingText text="INIT TERMINAL...." />
    </div>
  );
}

console.log("init terminal rendered");
