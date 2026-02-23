---
title: "DDIA Chapter 7: Transactions"
chapter: 7
part: "Part II: Distributed Data"
collection: ddia
---

- **Transaction**: Group reads/writes into one unit; all or nothing. (Myths: “drop transactions for scale” or “essential for vendors” are both exaggerated.)
- **ACID**:
  - **Atomicity**: Fault ⇒ whole transaction aborts; client can retry.
  - **Consistency**: DB in “good state”; application defines invariants, not the DB.
  - **Isolation**: Concurrent transactions isolated.
  - **Durability**: After commit, data not lost (disk; if replicated, to N nodes.)
- **Single-object**: Engines give atomicity + isolation per object (log + locks). **Multi-object**: Needed for FKs, denormalization, secondary indexes; hard across partitions; many distributed stores drop it. Leaderless: no rollback ⇒ app recovers. **Retry**: Can double-commit if ack lost; useless for permanent errors (e.g. constraint).

## Weak Isolation

- **Read committed**: No dirty reads, no dirty writes. **Dirty read** = see uncommitted write (partial updates, abort rollback); prevent with old/new value. **Dirty write** = overwrite uncommitted; row-level locks.
- **Read skew**: Same transaction sees DB at different times ⇒ backups, analytics, integrity at risk. **Snapshot isolation**: Read from consistent snapshot (frozen point in time); writers lock, readers don’t; multiple versions per object.
- **Lost update**: Two read-modify-write; one overwrites the other. **Fixes**: Atomic operations (e.g. UPDATE SET value = value+1); **SELECT FOR UPDATE**; detect lost update and abort/retry; **compare-and-set** (WHERE value = old); in replication ⇒ conflict resolution (e.g. LWW, merge).
- **Write skew**: Two transactions, two objects; result not serial. Fix: serializable, or lock dependent rows (FOR UPDATE), or constraints/triggers/materialized views.
- **Phantom**: New/missing rows in set being read; can’t lock non-existent rows. Fix: materialized conflicts (artificial lock). Prefer serializable.

## Serializability

- **Serializable isolation**: Strongest; prevents all these races. Levels are subtle; “use serializable” is the simple answer.
- **Actual serial execution**: One transaction at a time. Feasible with cheap RAM and small OLTP transactions; submit as stored procedure; can partition (one partition per transaction).
- **Two-phase locking (2PL)**: Shared (read) and exclusive (write) locks; deadlocks possible, DB aborts one. Bad performance and tail latency.
- **Serializable Snapshot Isolation (SSI)**: Optimistic; check at commit; fewer aborts; bad under high contention (commutative ops help); can partition/distribute.
