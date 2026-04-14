import { redis } from "@/lib/redis";
import {
  EVENT_WEIGHTS,
  MAX_OVERS,
  MAX_WICKETS,
} from "../../config/constants";
import { MatchEvent , EventType} from "@/types/event";
const matchId = "IND_vs_AUS_1";

// match state
let runs = 0;
let wickets = 0;
let over = 0;
let ball = 0;

// weighted random selection
function getRandomEvent(): EventType {
  const totalWeight = EVENT_WEIGHTS.reduce((sum, e) => sum + e.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const e of EVENT_WEIGHTS) {
    if (rand < e.weight) return e.type as EventType;
    rand -= e.weight;
  }

  return "DOT";
}

// map event → runs
function getRuns(event: EventType): number {
  switch (event) {
    case "FOUR":
      return 4;
    case "SIX":
      return 6;
    case "RUN":
      return Math.floor(Math.random() * 3) + 1; // 1–3
    case "WIDE":
    case "NO_BALL":
      return 1;
    default:
      return 0;
  }
}

function simulateBall(): MatchEvent | null {
  if (wickets >= MAX_WICKETS || over >= MAX_OVERS) {
    console.log("Match finished");
    return null;
  }

  const event = getRandomEvent();
  const runsScored = getRuns(event);

  // update state
  if (event === "WICKET") {
    wickets++;
  } else {
    runs += runsScored;
  }

  // ball progression (no increment for wide/no-ball)
  if (event !== "WIDE" && event !== "NO_BALL") {
    ball++;

    if (ball > 6) {
      over++;
      ball = 1;
    }
  }

  const currentOver = Number(`${over}.${ball}`);

  const matchEvent: MatchEvent = {
    matchId,
    runs,
    wickets,
    over: currentOver,
    ball,
    event,
    runsScored,
    timestamp: Date.now(),
  };

  return matchEvent;
}

async function startSimulation() {
  console.log("Starting match simulation...");

  const interval = setInterval(async () => {
    const event = simulateBall();

    if (!event) {
      clearInterval(interval);
      process.exit(0);
    }

    try {
      await redis.publish("sports:cricket", JSON.stringify(event));
      console.log("Published:", event);
    } catch (err) {
      console.error("Publish error:", err);
    }
  }, 2000);
}

startSimulation();