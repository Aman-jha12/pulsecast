import { redis } from "@/lib/redis";
import { EVENT_WEIGHTS, MAX_OVERS, MAX_WICKETS } from "@/config/constants";
import { MatchEvent, EventType } from "@/types/event";

const matchId = process.env.MATCH_ID || "IND_vs_AUS_1";
const channel = `sports:cricket:${matchId}`;

let runs = 0;
let wickets = 0;
let over = 0;
let ball = 0;

function getRandomEvent(): EventType {
  const total = EVENT_WEIGHTS.reduce((sum, e) => sum + e.weight, 0);
  let rand = Math.random() * total;

  for (const e of EVENT_WEIGHTS) {
    if (rand < e.weight) return e.type;
    rand -= e.weight;
  }
  return "DOT";
}

function getRuns(event: EventType): number {
  switch (event) {
    case "FOUR": return 4;
    case "SIX": return 6;
    case "RUN": return Math.floor(Math.random() * 3) + 1;
    case "WIDE":
    case "NO_BALL": return 1;
    default: return 0;
  }
}

function simulateBall(): MatchEvent | null {
  if (wickets >= MAX_WICKETS || over >= MAX_OVERS) {
    console.log(`Match ${matchId} finished`);
    return null;
  }

  const event = getRandomEvent();
  const runsScored = getRuns(event);

  if (event === "WICKET") wickets++;
  else runs += runsScored;

  if (event !== "WIDE" && event !== "NO_BALL") {
    ball++;
    if (ball > 6) {
      over++;
      ball = 1;
    }
  }

  return {
    matchId,
    runs,
    wickets,
    over: Number(`${over}.${ball}`),
    ball,
    event,
    runsScored,
    timestamp: Date.now(),
  };
}

async function start() {
  console.log(`Starting match: ${matchId}`);

  const interval = setInterval(async () => {
    const event = simulateBall();
    if (!event) {
      clearInterval(interval);
      process.exit(0);
    }

    await redis.publish(channel, JSON.stringify(event));
    console.log("Published:", event);
  }, 2000);
}

start();