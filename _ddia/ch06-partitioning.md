---
title: "DDIA Notes – Chapter 6: Partitioning"
chapter: 6
part: "Part II: Distributed Data"
collection: ddia
---

Chapter 6 is my reminder that \"just shard it\" hides a lot of real trade-offs.

Chapter 6: Partitioning

For huge datasets that doesn't fit in a single database, or for scalability purposes, partitioning (sharding) is the solution. Typically each piece of data belongs to exactly one partition, and a single operation might need to touch multiple partitions at once. Thus, complex queries should be parallelized across many nodes.

## Partitioning and Replication

Replication and partitioning usually works together hand-in-hand, so partitions are usually stored on several nodes for fault-tolerance. However, the choice of partitioning and replication schemes are mostly independent.

## Partitioning of Key-Value Data

The goal of partitioning is to spread data evenly across nodes, and more importantly to avoid having skewed partitions with most of the load (resulting in hot spots).

There are two main ways of partitioning keys:

- Partitioning by key range, that is by sorting the keys we have, and assigning boundaries between ranges. This is suitable for range queries, but requires continuous boundaries adaptation, with the risk of still having hot-spots
- Partitioning by hash key, that is by using a non-cryptographic hash function (eg. MD5), and partition using range of hashes instead of keys. This provides more randomization, and also can be used in partitioning by compound primary key which enables one-to-many relationships, but we lose the range queries ability.

One problem still is when most reads and writes are for the same key (eg. celebrity account ID), it is usually left for the application to handle this skew, typically by assigning random bytes at the beginning/end of this key to scatter it across all the replicas, however, this requires extra bookkeeping, as well as requests to all the replicas when reading.

## Partitioning of Secondary Indexes

Secondary indexes are important to all relational databases, and also some document databases. However, they don't map neatly to partitions.

One option is to add an extra secondary index inside every partition, this index would cover-up only the keys in the partition. However, if the client needs to find all fields with a common secondary field, it has to query all partitions.

Another option is to have a global secondary index which can also be partitioned, but using term instead of document. Every partition would keep a secondary index of some of these terms, this makes reads more efficient, but writes are slower and complicated. However, in practice updates to global secondary indexes are asynchronous and very fast.

## Rebalancing Partitions

Over time, data has to be moved from one node to another, this re-balancing process is expected to meet some minimum requirements:

- After re-balancing, the load should be shared fairly between nodes
- While re-balancing, the database should continue accepting reads and writes
- Data shouldn't be moved between nodes more than necessary

A top of mind strategy for re-balancing might be using mod operation for the hash of the key, but this turns out to be very bad because if the number of nodes changes, most keys will need to be moved.

A good alternative is to have a fixed number of partitions, by creating many more partitions than there are nodes, and assign several partitions to each node, and when a node is added to the cluster, it steals some partitions as are from older nodes. This can allow us to assign more partitions to nodes that are more powerful, but since the number is fixed, partitions can get very large, thus making re-balancing and recovery from failures very expensive, and if they are too small, it is too much overhead.

Another alternative is dynamic partitioning, which acts similarly to the top level of a B-tree, when partitions exceeds a configured size, it's split into two partitions, and when shrinks when goes below another configured size, then partitions can be moved to different nodes for re-balancing the load. The big advantage is that the number of partitions adapts to the total volume.

Another option is Partitioning proportionally to nodes, which is to have a fixed number of partitions per node. When a new node joins, it picks fixed number of random partitions to split and take half of them. However, the randomization might produce unfair splits.

Having a completely automated re-balancing process can be very unpredictable, so it's good to have a human in the loop for re-balancing.

## Request Routing

Similar to all network systems, service discovery problem needs to be approached, for which we need a mechanism of mapping keys to partition and their hosting nodes. This mechanism can be placed inside the nodes, routing tier (load balancer), or clients themselves.

Many distributed systems rely on a coordination service such as Zoo-Keeper for solving this problem, that is by keeping track of cluster's metadata including partitioning.

