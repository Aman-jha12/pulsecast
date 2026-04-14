import Redis from "ioredis";

const sub = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const milestoneMap = new Map<string, number>();

async function start() {
  console.log("Alerts started");

  await sub.psubscribe("sports:cricket:*");

  sub.on("pmessage", (_, channel, message) => {
    const data = JSON.parse(message);
    const { event, runs, matchId } = data;

    if (event === "WICKET") {
      console.log(`🚨 ${channel} WICKET!`);
    }

    if (event === "FOUR" || event === "SIX") {
      console.log(`🔥 ${channel} ${event}`);
    }

    const last = milestoneMap.get(matchId) || 0;
    const current = Math.floor(runs / 50) * 50;

    if (current > 0 && current !== last) {
      console.log(`🏏 ${channel} reached ${current}`);
      milestoneMap.set(matchId, current);
    }
  });
}

start();