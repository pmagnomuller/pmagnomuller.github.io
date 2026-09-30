---
title: "DDIA Chapter 8: The Trouble with Distributed Systems"
chapter: 8
part: "Part II: Distributed Data"
collection: ddia
---

## Core ideas

Distributed systems fail **partially** and nondeterministically. Assume it.

- **Networks** — loss, delay, partitions; detect with timeouts (too short → cascading failure)
- **Clocks** — wall clock for dates (NTP, can jump); **monotonic** for durations; do not order events by wall time alone — use logical clocks
- **Truth** — a node cannot trust itself; use quorums; **fencing tokens** on locks/leases
- Byzantine faults are costly; inside a DC, checksums + validation usually suffice

Useful models: **partially synchronous** + **crash-recovery**. Distinguish **safety** (never wrong) vs **liveness** (eventually happens).

## Picture

```mermaid
flowchart LR
  A[Node A] -.->|timeout?| B[Node B]
  A -->|retry / failover| C[Node C]
```

```mermaid
sequenceDiagram
  participant N as Node
  participant L as Lock service
  participant S as Storage
  N->>L: acquire lease
  L-->>N: token=33
  N->>S: write with token=33
  S-->>N: reject if token < fenced
```

## Example

### Prefer monotonic for elapsed time

```java
long start = System.nanoTime(); // monotonic-ish for measuring duration
doWork();
long elapsedNs = System.nanoTime() - start;

// System.currentTimeMillis() can jump backward/forward with NTP
```

### Fencing token

```java
void write(String key, byte[] value, long fencingToken) {
  if (fencingToken < store.currentFence(key)) {
    throw new StaleLockException();
  }
  store.put(key, value, fencingToken);
}
```

## Takeaways

- Timeouts are guesses — measure and adapt
- Wall clocks lie; causality needs logical tools
- Safety first; liveness may wait for majority recovery
