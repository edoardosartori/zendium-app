export type BootEvent =
  | { type: "logo" }
  | { type: "starting" }
  | { type: "welcome" }
  | { type: "system-info" }
  | { type: "news" }
  | { type: "init-terminal" }
  | { type: "terminal" };

export const timeline: BootEvent[] = [
  { type: "logo" },
  { type: "starting" },
  { type: "welcome" },
  { type: "system-info" },
  { type: "news" },
  { type: "init-terminal" },
  { type: "terminal" }
];