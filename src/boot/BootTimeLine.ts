export type BootEvent =
  | { type: "logo" }
  | { type: "welcome" }
  | { type: "terminal" }
  | { type: "grid-transition" }
  | { type: "pulse-transition" };

export const timeline: BootEvent[] = [
  { type: "logo" },
  { type: "pulse-transition" },
  { type: "welcome" },
  { type: "grid-transition" },
  { type: "terminal" },
];
