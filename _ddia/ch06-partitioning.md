---
title: "DDIA Chapter 6: Partitioning"
chapter: 6
part: "Part II: Distributed Data"
collection: ddia
---

- **Partitioning (sharding)**: For data too large or for scale. Each datum in one partition; one op can touch many partitions ⇒ parallelize.
- **With replication**: Partitions replicated across nodes; partitioning and replication choices largely independent.

## Key-Value Partitioning

- **Goal**: Even spread; avoid hot spots.
- **By key range**: Sort keys, assign ranges. Good for range queries; need to adapt boundaries; risk of hot spots.
- **By hash**: Hash key (e.g. MD5), partition by hash range. More even; lose range queries. Compound key can give one-to-many.
- **Hot key** (e.g. celebrity): App-level skew handling (e.g. random suffix/prefix ⇒ scatter); extra bookkeeping and multi-replica reads.

## Secondary Indexes

- Don’t map cleanly to partitions. **Local index per partition**: Only that partition’s keys; global query ⇒ all partitions. **Global secondary index**: By term, partitioned; reads efficient, writes slower/complex; often updated async.

## Rebalancing

- **Requirements**: Fair load after; accept reads/writes during; minimize data movement.
- **Avoid**: hash mod N ⇒ changing N moves most keys.
- **Fixed partitions**: Many partitions > nodes; new node takes partitions from others. Can weight by node power; fixed count ⇒ very large or very small partitions.
- **Dynamic**: Split when too big, shrink when too small (like B-tree top level); partition count adapts to data.
- **Fixed per node**: New node splits random partitions, takes half. Random ⇒ unfair splits possible.
- **Human in the loop** for rebalancing often better than full automation.

## Request Routing

- **Service discovery**: Map key → partition → node. Can live in nodes, routing tier (load balancer), or clients. Often **ZooKeeper** (or similar) for cluster metadata including partitioning.
