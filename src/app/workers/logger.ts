import Redis from "ioredis";

const sub = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

async function start() {
  console.log("Logger started");

  await sub.psubscribe("sports:cricket:*");

  sub.on("pmessage", (_, channel, message) => {
    const data = JSON.parse(message);

    console.log(
      `[${channel}] ${data.over} | ${data.event} | ${data.runs}/${data.wickets}`
    );
  });
}

start();