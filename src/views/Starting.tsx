import TypingText from "../core/utils/TypingText";
import ThemableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

export default function Starting({ onComplete }: Props) {
  return (
    <div className="text">
      <ThemableIcon className="logo" />
      <TypingText text="Starting........" />
    </div>
  );
}

console.log("starting rendered");
