import ThemableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

export default function Logo({ onComplete }: Props) {
  return (
    <div>
      <ThemableIcon className="initial-logo" />
    </div>
  );
}

console.log("logo rendered");
