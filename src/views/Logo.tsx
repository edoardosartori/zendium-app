import { useEffect } from "react";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

export default function Logo({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text">
      <ThemeableIcon className="initial-icon" />
    </div>
  );
}

console.log("logo rendered");
