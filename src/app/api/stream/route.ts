import Redis from "ioredis";

export async function GET() {
  const subscriber = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
  );

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      await subscriber.subscribe("sports:cricket");

      const onMessage = (_: string, message: string) => {
        controller.enqueue(
          encoder.encode(`data: ${message}\n\n`)
        );
      };

      subscriber.on("message", onMessage);

      // cleanup when client disconnects
      return () => {
        subscriber.off("message", onMessage);
        subscriber.quit();
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