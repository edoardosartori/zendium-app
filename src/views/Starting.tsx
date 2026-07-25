import { useEffect } from "react";
import TypingText from "../core/utils/TypingText";

type Props = {
  onComplete: () => void;
};

export default function Starting({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text">
      <TypingText text="Starting{pause:800}.{pause:800}.{pause:800}.{pause:800}.{pause:800}" />
    </div>
  );
}

console.log("starting rendered");
