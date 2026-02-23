---
title: "DDIA Chapter 9: Consistency and Consensus"
chapter: 9
part: "Part II: Distributed Data"
collection: ddia
---

- **Fault handling**: Simplest = fail and show error; better = abstractions with guarantees. **Consensus** = getting nodes to agree.

## Linearizability

- **Linearizability**: One logical copy; all ops atomic. If one read sees new value, every later read (any client) sees it. **Test**: Record request/response timings; check sequential.
- **Vs serializability**: Serializability = isolation (transactions as if serial). Linearizability = **recency** (read/write order). 2PL and serial execution are usually linearizable; SSI is not.
- **Uses**: Leader election (lock), uniqueness, cross-channel timing. FK/attribute constraints don’t need it.
- **Implementation**: Single copy = linearizable but not fault-tolerant. **Single-leader** or **consensus** for linearizability + fault tolerance. Multi-leader = not linearizable. Leaderless = barely, with cost (not recommended).
- **CAP**: Without linearizability ⇒ can stay available despite network issues. Linearizability is slow even without faults.

## Ordering & Causality

- **Causal consistency**: Order respects causality (e.g. snapshot isolation). **Partial order**: Concurrent ops arbitrary order; non-concurrent ordered. **Total order** (linearizability): any two comparable. Causal = strongest that doesn’t slow/fail on network.
- **Tracking**: Version vectors (full causal deps); or **sequence numbers / timestamps** (logical clock) for total order, more compact.
- **Lamport timestamps**: Node/client keeps max counter seen; attach to every request. **Vs version vectors**: Vectors distinguish concurrent vs causally dependent; Lamport = total order only, more compact; can’t detect concurrency.
- **Total order broadcast**: Reliable + totally ordered delivery to all. Used for: replication, serializable txns, log, fencing tokens.

## Distributed Transactions & Consensus

- **Consensus**: Agreement; used in leader election, atomic commit. Theoretically impossible in unreliable async system; in practice timeouts and crash detection make it possible.
- **Atomic commit**: Single node = order of durable writes. Multiple nodes: can’t just “commit everywhere”; need protocol. Most NoSQL don’t support; many relational do.
- **2PC**: Coordinator → prepare (all ready?) → commit or abort. **Points of no return**: participant votes yes; coordinator decides. Participant can abort only if coordinator failed before prepare; after that, wait for coordinator (using log). **3PC**: Theoretically helps, not in practice.
- **Costs**: Operational pain, ~10× slower. **Internal** (same software, optimizations) vs **heterogeneous** (e.g. XA). Stuck transaction holds locks ⇒ unavailability; fix by human or heuristics.
- **Consensus properties**: Agreement; no double decision; decision was proposed; every non-crashed node eventually decides (needs majority correct). **Algorithms**: VSR, Paxos, Raft, Zab; most implement total order broadcast (consensus ≈ repeated broadcast). **Leader**: All have leader per epoch; two rounds (elect leader, vote proposal). **Limits**: Majority, fixed set, timeouts, network-sensitive.
- **Use**: Membership/coordination (e.g. ZooKeeper): linearizable ops, total order, failure detection, notifications, work allocation, discovery; usually used indirectly.
