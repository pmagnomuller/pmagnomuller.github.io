---
title: "DDIA Notes – Chapter 9: Consistency and Consensus"
chapter: 9
part: "Part II: Distributed Data"
collection: ddia
---

This is where the theory (consensus, linearizability, CAP) meets day-to-day architecture choices.

Chapter 9: Consistency and Consensus

The simplest way of handling system faults is to simply let the entire system fail, and then show an error message. But, the best way is to have a general-purpose abstraction with useful guarantees that we can implement.

Consensus is one of the tricky abstractions that helps with getting all of the nodes to agree on something.

## Consistency Guarantees

Most replicated databases provide at least eventual consistency, with such a weak guarantee we need to be aware of its limitations, and not to assume too much, as these limitations only appear when there is a fault in the system.

Systems with stronger guarantees usually have worse performance, but they are more appealing as they are more easy to use correctly.

## Linearizability

Linearizability is a strict model of consistency that makes a system appear as if only one copy of the data, and all operations on it are atomic.

To achieve linearization, we have to add a constraint that when any read returns a new value, all following reads on any client must also return the new value. It's important to note that this model doesn't assume any transaction isolation though.

It's possible to test whether a system is linearizable by recording the timings of all requests and responses and check whether they are sequential.

Linearizability is often confused with serializability, but they are two quite different guarantees. Serializability is an isolation property, it guarantees that transactions behaves the same as if they were executed serially. Linearizability however is a recency guarantee on reads and writes. A database may provide both guarantees, two-phase locking and actual serial execution are typically linearizable, while serial snapshot isolation is not (by design).

Linearizability is important in few areas such as leader election using a lock, constraints and uniqueness guarantees, and cross-channel timing dependencies. Without such recency guarantees, race conditions can happen, and linearization might be the easiest way to avoid it. However, some constraints such as foreign key or attribute constraints doesn't require linearization.

Systems with a single copy of data are linearizable, but not fault-tolerant. So to implement linearizability with fault-tolerance we need either a single-leader replicated system, or to use consensus algorithms. Systems with multi-leader replication are not linearizable, while leaderless replicated systems (Dynamo-style) are hardly linearizable at cost of reduced performance (not recommended).

According to CAP theorem, applications that don't require linearizability, can be more tolerant of network problems, because it can remain available in the face of them.

Although linearizability is a useful guarantee, few systems are actually linearizable in practice, as it is always slow even when there is no network fault, which decreases the performance significantly.

## Ordering Guarantees

Ordering helps preserve causality, and a system that obeys the order imposed by causality is called causally consistent (eg. snapshot isolation provides causal consistency).

Causality uses partial order, where concurrent operations may be processed in any order, but non-concurrent operations must be ordered. This is weaker than linearizability which uses total order, where it allows any two elements to be compared and ordered.

Linearizability doesn't have concurrent operations, however, it is one of the ways of preserving causality.

Causal consistency is the strongest possible consistency model that doesn't slow down or fail due to network failures or delays.

Causal consistency needs to track causal dependencies across the entire database, not just for a single key, so version vectors can be used for that. However, keeping track of all dependencies can become impractical, so a better way could be to use sequence numbers or timestamps (from a logical clock) to order events instead. These numbers are compact and provide a total order.

The best known way of generating sequence numbers for causal consistency is Lamport timestamps, where every node and every client keeps track of the maximum counter value it has seen so far, and then includes it on every request.

The difference between Lamport timestamps and version vectors, is that version vectors can distinguish whether two operations are concurrent or weather one is causally dependent on the other, whereas Lamport timestamps always enforce total ordering. Lamport timestamps are more compact, but we cannot use it to tell whether two operations are concurrent or casually dependent.

In order to use total ordering between multiple nodes, we should use total order broadcast, which is a message exchanging protocol that guarantees reliability (no messages are lost), and total ordered delivery of messages to all nodes.

Total order broadcast is used in database replication, serializable transactions, creating messages log, and lock for fencing tokens.

## Distributed Transactions and Consensus

The goal of consensus is to get several nodes to agree on something, it's very useful in leader election, and atomic commits.

Theoretically, consensus in impossible in an unreliable asynchronous system, but it's made possible in practice when timeouts and crash-detection are allowed.

Atomic commit is easy on a single node, as it just depends on the order in which data is durably written to disk, but it's quite challenging when performed across multiple nodes, as it's not sufficient to send a commit request to all nodes independently. Most NoSQL datastores don't support such transactions, but various relational systems do.

The most common algorithm for solving atomic commit across multiple nodes is two-phase commit (2PC), where applications read and write data on multiple database nodes as normal, and when each is ready to commit, the coordinator begins a prepare phase asking each node whether it's ready to commit, after which the coordinator sends to them either a commit or abort messages.

The 2PC protocol contains two crucial points of "no return", when a participant votes yes in the prepare phase, and when the coordinator decides the decision. The decision is irrevocable, but could be undone by another compensating transaction.

Participants of 2PC can safely abort if the coordinator failed before the prepare phase, but if the coordinator failed after that, the participant can do nothing but to wait for it to recover using it's log. A 3PC algorithm can solve this issue in theory but not in practice.

Distributed transactions provides important safety guarantees, but they are criticized for operational problems, and killing performance (up to 10 times slower). It can be implemented either as an internal protocol were all nodes runs the same software, which allow for optimizations, or as a heterogeneous protocol that requires all nodes to be implementing the same standard (eg. XA).

The problem with transaction that is stuck waiting for coordinator, is that it cannot release the locks it's holding, which can cause larger parts of the application to become unavailable. This can be fixed by either a human manual interaction, or using an automated heuristic decisions.

Consensus algorithm in a formalized form should satisfy 4 properties: all nodes should agree on the same decision, no node decides twice, if a node decides a value, then the value must have been proposed by some node, and every non-crashed node should eventually decide some value. However, for the last property to be guaranteed, the algorithm requires at least the majority of the nodes to be functioning correctly.

The best known fault-tolerance consensus algorithms are Viewstamped Replication, Paxos, Raft, and Zab. All of them (except Paxos) implement total order broadcast directly, as total order broadcast is equivalent to repeated rounds of consensus.

All consensus protocols use a leader internally, but don't guarantee the leader uniqueness, instead a weaker guarantee is to only guarantee the leader uniqueness within each epoch (lifetime of a leader). Thus, we end-up having two round of voting, once to choose a leader, and a second to vote on leader's proposal.

Some limitations of consensus algorithms include: it requires a strict majority to operate, it assumes a fixed set of nodes to participate in voting, it generally relies on timeouts to detect failed nodes, and it's sensitive to network problems.

One of the most important applications of fault-tolerant consensus algorithms are membership and coordination services (eg. ZooKeeper), they are used in linearizable atomic operations, total ordering of operations, failure detection, change notifications, allocating work to nodes, and service discovery. However, they're usually used indirectly through other services.

