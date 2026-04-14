import Redis from "ioredis";
import { MatchEvent } from "@/types/event";

const subscriber = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

async function startLogger() {
  console.log("Logger started...");

  await subscriber.subscribe("sports:cricket");

  subscriber.on("message", (channel, message) => {
    try {
      const data: MatchEvent = JSON.parse(message);

      // basic validation
      if (!data.matchId || data.runs === undefined) {
        console.log("Invalid event:", data);
        return;
      }

      // formatted output
      console.log(
        `[${data.matchId}] ${data.over} | ${data.event} | Score: ${data.runs}/${data.wickets} (+${data.runsScored})`
      );

    } catch (err) {
      console.error("Parse error:", err);
    }
  });
}

startLogger();