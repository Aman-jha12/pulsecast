import Redis from "ioredis";
import { MatchEvent } from "@/types/event";

const subscriber = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

let lastMilestone = 0;

async function startAlerts() {
  console.log("Alerts service started...");

  await subscriber.subscribe("sports:cricket");

  subscriber.on("message", (_, message) => {
    try {
      const data: MatchEvent = JSON.parse(message);

      const { runs, event, matchId, over, wickets } = data;

      // WICKET alert
      if (event === "WICKET") {
        console.log(`🚨 [${matchId}] WICKET at ${over}! Score: ${runs}/${wickets}`);
      }

      // Boundary alert
      if (event === "FOUR" || event === "SIX") {
        console.log(`🔥 [${matchId}] ${event} at ${over}! Score: ${runs}/${wickets}`);
      }

      // Milestone alert (50, 100, 150...)
      const milestone = Math.floor(runs / 50) * 50;

      if (milestone > 0 && milestone !== lastMilestone) {
        console.log(`🏏 [${matchId}] Reached ${milestone} runs!`);
        lastMilestone = milestone;
      }

    } catch (err) {
      console.error("Alert parse error:", err);
    }
  });
}

startAlerts();