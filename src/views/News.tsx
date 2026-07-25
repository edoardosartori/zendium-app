import TypingText from "../core/utils/TypingText";
import ThemableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

export default function News({ onComplete }: Props) {
  return (
    <div className="text">
      <ThemableIcon className="logo" />
      <TypingText text="NEWS" />
    </div>
  );
}

console.log("news rendered");
