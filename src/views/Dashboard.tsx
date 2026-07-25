import ThemableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

export default function Dashboard({ onComplete }: Props) {
  return (
    <div className="text">
      <ThemableIcon className="icon" />
      DASHBOARD
    </div>
  );
}

console.log("news rendered");
