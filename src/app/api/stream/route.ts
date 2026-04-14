import Redis from "ioredis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");

  if (!matchId) {
    return new Response("matchId required", { status: 400 });
  }

  const channel = `sports:cricket:${matchId}`;
  const sub = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      await sub.subscribe(channel);

      const handler = (_: string, message: string) => {
        controller.enqueue(
          encoder.encode(`data: ${message}\n\n`)
        );
      };

      sub.on("message", handler);

      return () => {
        sub.off("message", handler);
        sub.quit();
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}