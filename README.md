# PulseCast - Real-Time Sports Broadcasting System (Redis Pub/Sub)

ScoreStream is a backend-focused project that demonstrates **event-driven architecture using Redis Pub/Sub** by simulating real-time cricket matches and broadcasting live updates to multiple independent consumers.

---

## What this project is about

This is **not just a sports app**.

It is a system that shows how:
- one service publishes events
- multiple services consume the same event independently
- real-time systems work without polling

The cricket match is just a **data source**.

---

## Core Concept


Publisher → Redis Pub/Sub → Multiple Subscribers


Each event is broadcast once and consumed by:
- Logger
- Alerts system
- Commentary engine
- UI (via SSE)

---

## Architecture

            ┌──────────────┐
            │  Publisher   │
            │ (Simulator)  │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │   Redis      │
            │   Pub/Sub    │
            └──────┬───────┘
      ┌────────────┼────────────┐
      ▼            ▼            ▼
  Logger        Alerts     Commentary
                                 │
                                 ▼
                             Next.js UI
                             (SSE Stream)

---

## Key Features

- Real-time event broadcasting (no polling)
- Multi-channel Pub/Sub (`sports:cricket:<matchId>`)
- Multiple independent subscribers
- Live UI updates using Server-Sent Events
- Simulated cricket match engine
- Scalable event-driven design

---

## Tech Stack

- Next.js (App Router)
- Redis (Pub/Sub)
- ioredis
- Node.js workers
- Server-Sent Events (SSE)

---

## Project Structure


src/
app/
api/stream/route.ts # SSE endpoint
page.tsx # frontend UI

lib/
redis.ts # Redis client

workers/
publisher.ts # match simulator
logger.ts # logs events
alerts.ts # triggers alerts
commentary.ts # generates commentary

types/
event.ts # event schema

config/
constants.ts # event config


---

## How it works

### 1. Publisher 
- Simulates a cricket match
- Generates ball-by-ball events
- Publishes to Redis

Channel format:

sports:cricket:<matchId>


---

### 2. Redis Pub/Sub
- Broadcasts event to all subscribers
- No persistence
- No retry
- Fire-and-forget model

---

### 3. Subscribers

#### Logger
Prints structured logs

#### Alerts
Detects:
- wickets
- boundaries
- milestones

#### Commentary
Converts events → human-readable commentary

#### UI (Next.js)
Streams updates using SSE

---

## Example Event

{
  "matchId": "IND_vs_AUS_1",
  "runs": 120,
  "wickets": 3,
  "over": 15.2,
  "ball": 2,
  "event": "FOUR",
  "runsScored": 4,
  "timestamp": 171000000
}

## Running the Project
1. Start Redis
docker compose up -d
2. Start Next.js
npm run dev
3. Start Publishers (multiple matches)
MATCH_ID=IND_vs_AUS_1 npx tsx src/workers/publisher.ts
MATCH_ID=ENG_vs_PAK_1 npx tsx src/workers/publisher.ts
4. Start Subscribers
npx tsx src/workers/logger.ts
npx tsx src/workers/alerts.ts
npx tsx src/workers/commentary.ts
5. Open UI
http://localhost:3000

Select match and view live updates.

## Why Redis Pub/Sub?

# Used when:

real-time broadcast is required
multiple consumers need same event
low latency matters

# Not used when:

persistence is required
retries are needed
guaranteed delivery is needed
Limitations
No message persistence
No replay capability
No delivery guarantees
Single-node Redis (no clustering)
Possible Improvements
Replace Pub/Sub with Redis Streams (durability)
Add WebSockets instead of SSE
Store match history in database
Add player-level simulation
Deploy with Docker + cloud Redis
Add authentication layer
Horizontal scaling with multiple instances
What this project demonstrates
Event-driven architecture
Service decoupling
Real-time data flow
Multi-consumer systems
Backend system design thinking
Final Note

This project focuses on how systems communicate, not just what they display.

The goal is to understand:

how one event can drive multiple independent systems in real time

# Author : @Aman-jha12

Built as a backend-focused learning project to understand Redis Pub/Sub and event-driven systems.