import Redis from "ioredis";
import { MatchEvent } from "@/types/event";

const subscriber = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

function generateCommentary(event: MatchEvent): string {
  const { event: type, runsScored, over, runs, wickets } = event;

  switch (type) {
    case "FOUR":
      return `Over ${over}: Cracked for FOUR! Score ${runs}/${wickets}`;
    case "SIX":
      return `Over ${over}: Massive SIX! Score ${runs}/${wickets}`;
    case "WICKET":
      return `Over ${over}: WICKET falls! Score ${runs}/${wickets}`;
    case "RUN":
      return `Over ${over}: ${runsScored} run(s). Score ${runs}/${wickets}`;
    case "DOT":
      return `Over ${over}: Dot ball.`;
    case "WIDE":
      return `Over ${over}: Wide ball. Extra run awarded.`;
    case "NO_BALL":
      return `Over ${over}: No ball! Free hit coming.`;
    default:
      return `Over ${over}: Unknown event`;
  }
}

async function start() {
  console.log("Commentary service started...");

  await subscriber.psubscribe("sports:cricket:*");

  subscriber.on("pmessage", (_, channel, message) => {
    try {
      const data: MatchEvent = JSON.parse(message);

      const commentary = generateCommentary(data);

      console.log(`🎙️ ${channel} → ${commentary}`);

    } catch (err) {
      console.error("Commentary error:", err);
    }
  });
}

start();