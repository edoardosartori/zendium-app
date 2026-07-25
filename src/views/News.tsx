import { useEffect } from "react";
import TypingText from "../core/utils/TypingText";
import ThemableIcon from "@assets/themeable-icon.svg?react";

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
      <ThemableIcon className="icon" />
      <TypingText text="NEWS" />
    </div>
  );
}

console.log("news rendered");
