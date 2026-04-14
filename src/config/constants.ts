import { EventType } from "../types/event";

export const EVENT_WEIGHTS: { type: EventType; weight: number }[] = [
  { type: "DOT", weight: 30 },
  { type: "RUN", weight: 40 },
  { type: "FOUR", weight: 10 },
  { type: "SIX", weight: 5 },
  { type: "WICKET", weight: 5 },
  { type: "WIDE", weight: 5 },
  { type: "NO_BALL", weight: 5 },
];

export const MAX_OVERS = 20;
export const MAX_WICKETS = 10;