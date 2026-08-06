export type BootEvent =
  | { type: "logo" }
  | { type: "welcome" }
  | { type: "system-info" }
  | { type: "terminal" }
  | { type: "scan-transition" }
  | { type: "data-stream-transition" }
  | { type: "grid-transition" }
  | { type: "pulse-transition" }
  | { type: "orbit-transition" }
  | { type: "matrix-rain-transition" };

export const timeline: BootEvent[] = [
  { type: "logo" },
  { type: "data-stream-transition" },
  { type: "pulse-transition" },
  { type: "welcome" },
  { type: "scan-transition" },
  { type: "system-info" },
  { type: "orbit-transition" },
  { type: "grid-transition" },
  { type: "matrix-rain-transition" },
  { type: "terminal" },
];
