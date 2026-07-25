import { useEffect } from "react";
import TypingText from "../core/utils/TypingText";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

export default function News({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text">
      <ThemeableIcon className="icon" />
      <TypingText text="NEWS" />
    </div>
  );
}

console.log("news rendered");
