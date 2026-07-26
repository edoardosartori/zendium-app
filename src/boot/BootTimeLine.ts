export type BootEvent =
  | { type: "logo" }
  | { type: "starting" }
  | { type: "welcome" }
  | { type: "system-info" }
  | { type: "news" }
  | { type: "init-terminal" }
  | { type: "terminal" }
  | { type: "scan-transition" };

export const timeline: BootEvent[] = [
  { type: "logo" },
  { type: "starting" },
  { type: "welcome" },
  { type: "scan-transition" },
  { type: "system-info" },
  { type: "news" },
  { type: "init-terminal" },
  { type: "terminal" }
];