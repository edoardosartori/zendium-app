export type BootEvent =
  | { type: "logo"; duration: number }
  | { type: "system" }
  | { type: "terminal"; duration: number; lines: string[] }
  | { type: "hex"; duration: number }
  | { type: "radar"; duration: number }
  | { type: "dashboard"; duration: number };

export const timeline: BootEvent[] = [
  { type: "logo", duration: 1500 },
  { type: "system" },

  {
    type: "terminal",
    duration: 0,
    lines: [
      "Initializing kernel........OK",
      "Mounting filesystem........OK",
      "Loading drivers........OK",
      "Detecting hardware........OK",
    ],
  },

  { type: "hex", duration: 1500 },
  { type: "radar", duration: 2000 },

  {
    type: "terminal",
    duration: 0,
    lines: ["Loading dashboard..."],
  },

  { type: "dashboard", duration: 1500 },
];
