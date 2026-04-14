"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const es = new EventSource("/api/stream");

    es.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setData(parsed);
    };

    return () => es.close();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Live Cricket Score</h1>

      {data ? (
        <div>
          <h2>{data.matchId}</h2>
          <h3>
            {data.runs}/{data.wickets}
          </h3>
          <p>Over: {data.over}</p>
          <p>Event: {data.event}</p>
        </div>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}