---
title: "DDIA Chapter 5: Replication"
chapter: 5
part: "Part II: Distributed Data"
collection: ddia
---

- **Replication**: Easy if data static; hard when it changes (sync vs async, failed replicas).

## Leaders and Followers

- **Leader-based**: Writes only to leader → leader sends to followers; read from any replica. Common in DBs and brokers.
- **Sync replication**: Followers have latest copy; one slow follower blocks write. In practice: one or few sync, rest async. Async = no latency guarantee but widely used.
- **Adding follower**: Leader snapshot → copy to new follower → replay changes after snapshot.
- **Follower failure**: Log changes; on recovery, request changes since disconnect from leader.
- **Leader failure**: Elect new leader; others sync from it. **Risks**: New leader may miss updates (dangerous to discard); old leader may wake up → **split brain**.
- **Replication methods**: Statement-based (SQL as-is; env vars cause inconsistency); **WAL** (tight to storage engine); **logical log** (decoupled, backward compat); **trigger-based** (flexible, more bugs/overhead).

## Replication Lag

- Leader-based + async ⇒ lag. **Read-after-write**: Read own writes from leader (e.g. by timestamp); must hit leader DC; breaks with multiple devices.
- **Monotonic reads**: Same replica always ⇒ no “time going backward”; replica fail ⇒ reroute.
- **Consistent prefix**: Writes in order read in order ⇒ causal writes to same partition in order.
- If lag of minutes is unacceptable, need stronger guarantee.

## Multi-Leader

- **One leader per datacenter**: Less latency, tolerance, but **write conflicts**.
- **Problems**: Auto-increment, triggers, constraints. Avoid multi-leader if possible.
- **Conflict resolution**: Avoid conflicts first. Else: unique ID (highest wins), replica ID (higher wins), merge values, or store conflicts. **Topologies**: All-to-all, circular, star (latter two = single point of failure; all-to-all can have causality issues).

## Leaderless (Dynamo-Style)

- **Write-intensive**: Leader = bottleneck ⇒ clients write/read to several replicas in parallel.
- **Detecting inconsistency**: Read same key from multiple replicas; client overwrite with majority; or background repair.
- **Quorum**: w + r > n (n = replicas). Smaller w/r ⇒ more stale reads, lower latency, higher availability.
- **Concurrent writes**: No order ⇒ only safe option is merge.
- **Eventual consistency**; stronger guarantees need transactions/consensus. Good for multi-DC.
- **Convergence**: Last write wins (needs recency, loses durability); **happens-before** (detect concurrent ⇒ resolve); **merge** (keep all data, app presents); **version vectors** (version per replica, increment on write; pass vector to detect inconsistency).
