export type BootEvent =
  | { type: "logo"; duration: number }
  | { type: "starting"; duration: number }
  | { type: "welcome"; duration: number }
  | { type: "system-info"; duration: number }
  | { type: "news"; duration: number }
  | { type: "init-terminal"; duration: number }
  | { type: "dashboard" };

export const timeline: BootEvent[] = [
  { type: "logo", duration: 1500 },
  { type: "starting", duration: 1500 },
  { type: "welcome", duration: 1500 },
  { type: "system-info", duration: 1500 },
  { type: "news", duration: 1500 },
  { type: "init-terminal", duration: 1500 },
  { type: "dashboard" }
];
