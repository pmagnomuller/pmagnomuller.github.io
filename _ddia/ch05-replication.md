---
title: "DDIA Notes – Chapter 5: Replication"
chapter: 5
part: "Part II: Distributed Data"
collection: ddia
---

Replication is where my mental model shifts from \"one database\" to \"many imperfect copies that must somehow agree\".

Chapter 5: Replication

If the data doesn't change, replication would be as simple as copying it once to other replicas, but the difficulty lies in handling changes if it does, because we usually have to deal with many trade-offs such as sync vs async replication, and how to handle failed replicas.

## Leaders and Followers

Leader-based replication allows writes to only go through the leader, which then sends it to all other followers. The clients then can query any replica including the leader. Although its limitation, it's one of the most used replication algorithms in databases and message brokers.

Synchronous replication guarantees the followers to have and up-to-date copy of the data, but if one follower didn't respond, the write cannot proceed, that's why in practice only one of few other replicas are synchronous, while other are async. Even that sync replication normally is quite fast, there is not guarantee about its latency, that's why async replication is widely used.

To add a new follower to a leader-based system, the leader has to take consistent snapshots of its database, the latest snapshot is then copied to the new follower, and when the follower connects to the leader, it requests all the changes that happened after the snapshot. It becomes ready afterwards.

In case of a follower failure (which is usually detected through timeout), the follower has to keep a log of its data changes, and request all data changes happened during its disconnection form the leader after it wakes up. However, in case of leader failure, one of the followers has to elected as a new leader, and other followers has to sync data changes with it instead.

Downsides for automated leader-failure recovery are:

- The new leader may not have received all updates from older leader, discarding these updates is very dangerous.
- Old leader might wake up thinking it is the leader, resulting in split brain (two nodes believe they are the leader)

Writes that are sent to followers can take many forms, some are:

- Statement based replication, where the SQL statement is sent as is, however environment related variables (eg. randomness, time, etc.) will cause inconsistency, it can be replaced by static values from the leader, but it's generally not preferred
- Write-ahead log, where followers receives append-only logs, but this makes replication closely coupled to the storage engine
- Logical log replication, where different log formats are used to allow the log to decouple from the engine's internals. It also allows backward compatibility
- Trigger-based replication, it gives much flexibility for the application code to determine what to replicate. It's useful when flexibility is needed, but it's prone to more bugs and limitations, as well as greater overhead

## Problems with Replication Lag

Leader-based replication suits workloads with mostly reads and small percentage of writes, but realistically it has to be asynchronous.

Read-after-write consistency guarantees that the users always see any updates they submit themselves immediately, this is done through restricting the read of self-written data only from the leader. This can be known from the most recent write logical timestamp. The downsides are that any request of that kind must be routed to the leader's datacenter, and that user might be using multiple devices at once.

Monotonic reads consistency guarantees that users don't see newer writes before old ones, for this to happen, the client must always make its reads from the same replica. However, if the replica fails, rerouting must take place.

Consistent prefix reads guarantees that any sequence of writes that happens in a certain order, must be read in the same order. This happens by making sure casually related writes are written to the same partition, and are written in the same order.

When using eventual consistency, if we cannot live with a lag that increases to several minutes, a stronger guarantee should be used.

## Multi-Leader Replication

When a process is replicated across many datacenters, we can have a leader in each datacenter, this provides better performance due to hidden network delays, as well as failure tolerance as each datacenter can continue operating independently, and also better tolerance for network problems due to asynchronous replication. However, data may be concurrently modified in two different datacenters, so those write conflicts must be resolved.

Some retrofitted features in databases such as auto-incrementing keys, triggers, and integrity constrains are problematic, that's why multi-leader replication is considered dangerous and should be avoided if possible.

Since handling conflicts can be very tricky, avoiding them is the recommended approach. However when resolution is needed, some ways would be to give each write a unique ID and the highest ID wins, give each replica a unique ID and the higher takes precedence, merge conflicting values together, or record the conflicts in an explicit data structure.

Multi-leader replication comes in various topologies, the most common are all-to-all, circular, and star topologies. A problem with circular and star topologies is that they have a single point of failure. All-to-all topology doesn't have this problem, but it may have problems with causality as some network links might be faster than others.

## Leaderless Replication

When our system is write-intensive, leader(s) may act as a bottleneck, that's when leader-less replication comes in handy, also known as Dynamo-style. The clients send their writes and reads to several replicas in parallel.

Reading the same key from different replicas can help detect inconsistency, so the client can re-write inconsistent field with the majority's value. Another mechanism is to have a background process that constantly check for differences and amend them asynchronously.

The numbers of replicas to read from (r), and to write to (w) should be configured to follow the quorums formula: w + r > n, where (n) is the number of replicas. Smaller values of w or r results in more stale read values, but provides lower latency and higher availability.

When two writes occur concurrently, with no way of finding which happened first, the only safe solution is to merge the writes.

Dynamo-style is usually optimized for eventual consistency use cases, more stronger guarantees require transactions or consensus.

Leaderless replication is suitable for multi-datacenter operation.

The problem with eventual consistency is that if each node simply overwrote the value of the key whenever it receives it, the nodes would become permanently inconsistent, some solutions include:

- Last write wins, as long as we have a way of determining which write was the recent, replicas would end-up being consistent, this solution achieves convergence but at the cost of durability
- Happens-before, is a mechanism of detecting whether two operations are concurrent, only then, a conflict needs resolution
- Merge values, it guarantees the we don't lose any of the conflicting data, and then it's up to the application how to show them
- Version vectors (version clock), which is assigning a version number per replica, and each replica has to increment it's number after every write, if an array of all version numbers is passed alongside the operations, it would be easy to detect inconsistency

