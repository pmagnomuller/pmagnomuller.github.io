---
title: "DDIA Chapter 12: The Future of Data Systems"
chapter: 12
part: "Part III: Derived Data"
collection: ddia
---

## Data Integration

- **No single tool** for all use cases; compose several. **Same data, multiple stores** ⇒ conflicting writes; best: **single system of record** for ordering, others derive.
- **Distributed transactions**: Classic for consistency; give linearizability but overhead. **Log-based derived data** = promising middle ground.
- **Batch + stream**: Strong functional flavor; good for fault tolerance and reasoning. **Derived views**: Old and new schema side by side; always have working system.
- **Lambda architecture**: Stream for fast approximation + batch for correct version; immutable events; both use derived views; downside = running and debugging two systems.

## Unbundling Databases

- **DB** = many components we assume work together. Synchronous ⇒ distributed transactions. **Async event log** (idempotent) = more robust ⇒ **unbundle**: behave like DB but built from loosely coupled parts. **Goal**: Combine stores for wider workload range than one product. Separate **durable storage** and **application execution**; still independent. **Vs microservices**: Dataflow = one-way, async (stream join), not request/response (RPC). Stream/messaging can extend to end-user devices.

## Correctness

- **Transactions** = decades of correctness; not disappearing; correctness also possible in **dataflow**. Strong safety (e.g. serializable) ≠ no loss/corruption; **immutable data** helps recovery; **idempotent** ops help. 2PC doesn’t guarantee exactly-once; need **end-to-end** (no full abstraction yet). **Consensus**: Single leader common; unbundled + log-based can enforce uniqueness.
- **Partitioned logs** instead of atomic commit: Client assigns request ID → append to partition by ID; processor reads log, emits with ID; downstream consume. **Consistency** = **timeliness** + **integrity**. Timeliness violation = eventual consistency; integrity = perpetual, can be catastrophic. **Event dataflow**: No timeliness guarantee; integrity via: one message = one atomic write; deterministic derivation; **client request ID** through pipeline (dedup); immutable messages.
- **Auditing**: Don’t blindly trust software; detect corruption (automated, continuous); fix and trace. Event systems = clearer “why” for mutations; deterministic dataflow = easier debug/trace. **End-to-end** pipeline correctness = confidence in disks, network, services, algorithms.

## Doing the Right Thing

- Systems have intended and unintended effects; we must consider both. **Predictive/ML**: Bias in input ⇒ learned and amplified. **Retention**: Purge when not needed; conflicts with immutability; **cryptographic access control** may help over policy alone.
