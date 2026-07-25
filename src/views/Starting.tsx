import { useEffect } from "react";
import TypingText from "../core/utils/TypingText";

type Props = {
  onComplete: () => void;
};

export default function Starting({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text">
      <TypingText text="Starting......." />
    </div>
  );
}

console.log("starting rendered");
