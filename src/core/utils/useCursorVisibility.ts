import { useEffect } from "react";

export function useCursorVisibility(showCursor: boolean): void {
  useEffect(() => {
    const element =
      document.querySelector(".persistent-shell") || document.body;

    if (showCursor) {
      element.classList.remove("hide-cursor");
    } else {
      element.classList.add("hide-cursor");
    }

    return () => {
      element.classList.remove("hide-cursor");
    };
  }, [showCursor]);
}
