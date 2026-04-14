"use client";

import { useEffect, useState } from "react";

interface MatchData {
  matchId: string;
  runs: number;
  wickets: number;
  over: number;
  event: string;
}

export default function Page() {
  const [matchId, setMatchId] = useState("IND_vs_AUS_1");
  const [data, setData] = useState<MatchData | null>(null);

  useEffect(() => {
    const es = new EventSource(`/api/stream?matchId=${matchId}`);

    es.onmessage = (e) => {
      setData(JSON.parse(e.data));
    };

    return () => es.close();
  }, [matchId]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Live Score</h1>

      <select onChange={(e) => setMatchId(e.target.value)}>
        <option value="IND_vs_AUS_1">IND vs AUS</option>
        <option value="ENG_vs_PAK_1">ENG vs PAK</option>
      </select>

      {data && (
        <>
          <h2>{data.matchId}</h2>
          <h3>{data.runs}/{data.wickets}</h3>
          <p>Over: {data.over}</p>
          <p>{data.event}</p>
        </>
      )}
    </div>
  );
}