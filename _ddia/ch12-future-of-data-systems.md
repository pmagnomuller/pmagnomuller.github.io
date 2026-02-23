---
title: "DDIA Chapter 12: The Future of Data Systems"
chapter: 12
part: "Part III: Derived Data"
collection: ddia
---

## Data Integration

There is unlikely to be one piece of software that is suitable for all the different use cases, trying to do everything in one piece of software almost guarantees poor implementation, so applications need to compose several different pieces to serve its goals.

When copies of the same data need to be maintained in several storage systems to satisfy different access patterns, some concurrency problems occurs (eg. conflicting writes), so the best approach (when possible) is to funnel all input into a single system (system of records) that decides the ordering of all writes, then it becomes more easier for other systems to derive data from it.

Distributed transactions have been always considered the classic way of keeping different data systems consistent, their biggest advantage opposed to asynchronous derived data systems is that they provide linearizability, but this always comes with some limitations and overheads. However, a middle-ground approach of log-based derived data might be the most promising data system right now.

Both batch processing and streaming processing has a quite strong functional flavor which is good for fault tolerance, and for reasoning about the dataflows inside an organization.

Derived views allow gradual evolution, which means we can maintain two (old and new) schemas side by side independently. The beauty of this is that we always have a working system to go back to.

Some systems which need a quickly approximated data through stream processing, as well as correct and reliable version of the data later through batch processing, usually use lambda architecture, which records incoming data as immutable events to an always-growing dataset, and runs both systems in parallel, where each uses a derived view. The only down side is the operational complexity of debugging and maintaining two different systems.

## Unbundling Databases

Database is consisted of different interacting components that we usually take for granted to work synchronously to achieve the desired storage role. This traditional synchronous actions require distributed transactions with all its overheads, so an asynchronous event-log (with Idempotence) might be a much more robust and practical approach, which leads us to the concept of unbundling the database.

Unbundling the database means building systems that abstractly acts like a database, but it in fact consists of a loosely coupled components. This has the advantages of making the system more robust to outages or performance degradation of individual components.

The goal of unbundling is to allow to combine several different databases in order to achieve good performance for much wider range of workloads that no single piece of software can satisfy them all.

It might make sense to have some parts of a system that specialize in durable data storage, and other parts that specialize in running application code. The two can interact while still remaining independent.

The difference between dataflow systems compared to microservices is that it has a one-directional, asynchronous communication mechanism, rather than synchronous request/response interaction, so instead of RPC we have a stream join between events.

The ideas of stream processing and messaging and not restricted to datacenters, but we can extend them all the way to the end-user devices.

## Aiming for Correctness

Transactions have been the choice for building correct applications for more than four decades by now, and while in some areas they have been completely abandoned for their overheads, they are not going away, but also correctness can be achieved in the context of dataflow.

Data systems that provide strong safety properties (eg. serializable transactions) are not guaranteed to be free from data loss or corruption. However, it would be easier to recover from such mistakes by preventing faulty code from destroying good (immutable) data. One of the most effective approaches to achieve this is to make all operations idempotent.

Two-phase commits are not sufficient to ensure that the transaction will be executed once, so to make an operation idempotent, we need to consider end-to-end flow of the whole operation. However, we don't have such an abstraction yet.

The most common way of achieving consensus is by having a single leader node, but also the unbundled database approach with log-based messaging have a similar approach to enforce uniqueness constraint.

Traditionally, executing transactions across multiple partitions requires an atomic commit, but equivalent correctness can be achieved with partitioned logs as follows:

- The request is given a unique ID by the client, and atomically appended to the log partitioned based on its ID
- A stream processor reads the log for requests, and emits message(s) with the request ID to output streams
- Further processors consumes the output streams

Consistency conflates two different requirements, which are timeliness and integrity. Violation of timeliness is eventual consistency, whereas violation of integrity is perpetual consistency and can be catastrophic!

Event-based dataflow systems decouples timeliness and integrity, there is no guarantee of timeliness, but integrity can be achieved through:

- Representing the content of the atomic write operation as a single message
- Deriving all other state updates from the single message using deterministic derivation functions
- Passing a client-generated request ID through all these levels of processing, enabling end-to-end duplicate suppression
- Making messages immutable

It is always a good idea not to just blindly trust the guarantees given by a software, no matter how widely used it is, because bugs can always creep in. We should have a way of finding out (preferably automatically and continually) if the data has been corrupted so that we can fix it and track down the source of error. This is known as auditing.

Event-based systems can provide better auditability than transaction-based systems, as it gives a clear picture of why the mutations were performed. Also, a deterministic and well-defined dataflow makes it easier to debug and trace the execution of the system.

It would be better if we can check that the entire derived data pipeline is correct end-to-end, which can give us confidence about the correctness of any disks, networks, services, and algorithms along the path.

## Doing the Right Thing

Every system is built for a purpose which has both intended and unintended consequences. We are responsible to carefully consider those consequences.

Predictive analytics systems which usually rely on machine learning can be very misleading. If there is a systematic bias in the input, the system will most likely learn and amplify that bias in the output.

We should not retain data forever, but purge it as soon as it is no longer needed. This contradicts with the idea of immutability, but a promising approach might be to enforce access control through cryptographic protocols, rather than merely by policy.

