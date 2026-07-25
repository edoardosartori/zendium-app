import TypingText from "../core/utils/TypingText";
import ThemableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

export default function Welcome({ onComplete }: Props) {
  return (
    <div className="text">
      <ThemableIcon className="logo" />
      <TypingText text="WELCOME" />
    </div>
  );
}

console.log("welcome rendered");
