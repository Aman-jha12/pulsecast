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

  // state
  runs: number;
  wickets: number;

  over: number;   // 12.3 (over.ball)
  ball: number;   // 1–6 (explicit, avoids ambiguity)

  // event info
  event: EventType;
  runsScored: number; // 0,1,2,3,4,6

  // metadata
  timestamp: number;
}