import { useEffect } from "react";
import TypingText from "../core/utils/TypingText";

type Props = {
  onComplete: () => void;
};

export default function Welcome({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="welcome-text">
      <div className="welcome-logo">
        <TypingText
          speed={15}
          text={` ██╗    ██╗███████╗██╗      ██████╗  ██████╗ ███╗   ███╗███████╗
 ██║    ██║██╔════╝██║     ██╔════╝ ██╔═══██╗████╗ ████║██╔════╝
 ██║ █╗ ██║█████╗  ██║     ██║      ██║   ██║██╔████╔██║█████╗
 ██║███╗██║██╔══╝  ██║     ██║      ██║   ██║██║╚██╔╝██║██╔══╝
 ╚███╔███╔╝███████╗███████╗╚██████╗ ╚██████╔╝██║ ╚═╝ ██║███████╗
  ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝╚══════╝`}
        />
      </div>
    </div>
  );
}

console.log("welcome rendered");
