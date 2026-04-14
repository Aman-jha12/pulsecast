export type EventType =
  | "RUN"
  | "FOUR"
  | "SIX"
  | "WICKET"
  | "DOT"
  | "WIDE"
  | "NO_BALL";

export interface MatchEvent {
  matchId: string;
  runs: number;
  wickets: number;
  over: number;
  ball: number;
  event: EventType;
  runsScored: number;
  timestamp: number;
}