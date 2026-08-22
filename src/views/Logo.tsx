import { useEffect } from "react";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

import "@style/views/logo.css";

type Props = {
  onComplete: () => void;
};

export default function Logo({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="central-view logo-view">
      <ThemeableIcon className="initial-icon logo-icon" />
    </div>
  );
}

if (import.meta.env.DEV) {
  console.log("logo rendered");
}
