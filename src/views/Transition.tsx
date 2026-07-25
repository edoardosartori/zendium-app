import { useEffect } from "react";
import TypingText from "../core/utils/TypingText";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

export default function Transition({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text">
      <ThemeableIcon className="logo" />
      <TypingText text="TRANSITION" />
    </div>
  );
}

console.log("transition rendered");
