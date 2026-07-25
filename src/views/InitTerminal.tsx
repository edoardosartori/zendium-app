import TypingText from "../core/utils/TypingText";
import ThemableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

export default function Init({ onComplete }: Props) {
  return (
    <div className="text">
      <ThemableIcon className="logo" />
      <TypingText text="INIT TERMINAL...." />
    </div>
  );
}

console.log("init terminal rendered");
