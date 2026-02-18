---
title: "DDIA Notes – Chapter 7: Transactions"
chapter: 7
part: "Part II: Distributed Data"
collection: ddia
---

Chapter 7 is my sanity check: yes, transactions are still useful, even if we sometimes decide not to use them.

Chapter 7: Transactions

A transaction is a way of an application to group several reads and writes together into a logical unit, which either succeeds or fails entirely.

## The Slippery Concept of a Transaction

There are wrong misconceptions that any large system should abandon transactions in order to maintain good performance and high availability, and that transactions are essential to database vendors, but these viewpoints are pure hyperbole.

Transactions are usually associated with the ACID properties:

- Atomicity: something that cannot be broken down into smaller parts, so when a client wants to make several writes, but a fault occurs, the whole transaction aborts and the client can safely retry
- Consistency: that the database is being in a "good-state", which is not something the application should guarantee, not the database
- Isolation: means that concurrently executing transactions are isolated from each other
- Durability: the promise that once a transaction has committed, its data will not be forgotten, for single node, this only means writing to a hard drive, but for replicated databases, it requires copying the data to some number of nodes

Storage engines almost universally aim to provide atomicity and isolation on the level of single object. Atomicity can be implemented using log for crash recovery, and isolation using a lock on each object.

Multi-object transactions might be needed when a foreign key references to a row in another table, or when de-normalized information and secondary indexes needs to be updated. However, many distributed datastores abandoned multi-object transactions because they are difficult to implement across partitions.

Leaderless replicated datastores won't undo something it has already done, so it's the application's responsibility to recover from errors.

Retrying aborted transactions isn't prefect because if the network failed while the server is trying to acknowledge the successful commit, the transaction might get performed twice, or when the error is permanent (eg. constraint violation), retrying would be pointless.

## Weak Isolation Levels

Concurrency bugs are hard to find by testing, for that, databases have long tried to hide it by providing transaction isolation, especially serializable isolation. However, due to its performance cost, systems use weaker levels of isolations more commonly, which protect against some concurrency issues, but not all.

Many popular relational databases that are considered "ACID" use weak isolation themselves.

The most basic level of transaction isolation is read committed, which simply just prevents dirty reads and dirty writes.

Dirty reads is when a transaction can read another transaction's write that hasn't been committed yet, this is useful because if the transaction needs to update several objects, other transactions might see some updates but not others, and if the transaction aborts, any writes would need to rollback. To prevent dirty reads, a lock might be used, however, this harms the response time, so a better approach is to remember both the old and new values, and give the old value to any read request before commitment.

Dirty writes is when a transaction write overwrites another transaction's uncommitted write, this is useful because if the transaction updates multiple objects, dirty writes can lead to bad outcome, however, preventing it still doesn't prevent some other race conditions. Most databases prevents dirty writes by using row-level locks.

Read committed isolation doesn't protect against read skew, where a transaction reads different parts from the database in different points of time, this can be cause issues for situations like backups, analytic queries, or integrity checks.

The solution to read skews is snapshot isolation, where each transaction reads from a consistent snapshot of the database, as if it was frozen at a particular point in time. It is usually implemented using write locks, but readers doesn't require any locks.

Snapshot isolation reads differ from read committed in that it keeps several versions of an object instead of just two.

Indexing might sound like a problem for snapshot isolation, but one solution is to have the index point to all versions of an object, while another approach is to use an append-only/copy-on-write variant that doesn't overwrite pages in the underlying tree.

A common pattern in databases is read-modify-write, which might lead to lost update problem. This problem occur when two concurrent transactions perform read-modify-write cycle, and one of the updates was overridden and lost.

There are variety of solutions that has been developed for solving the lost update problem:

- Atomic writes, which is usually the best solution if the code can be expressed in terms of operations, that is like UPDATE counters SET value = value + 1 WHERE .... Unfortunately not all writes can be expressed this way, and it's easy with ORMs to miss things up
- Explicit locking, where the application explicitly locks objects that are being updated: SELECT * FROM ... WHERE ... FOR UPDATE
- Automatically deleting lost updates, where the database allows the transaction to execute in parallel, and detects a lost update if happened, abort the transaction and force it to retry. An advantage to this is that the database performs the check efficiently in conjunction with snapshot isolation, and the detection happens automatically and is thus less error-prone
- Compare and set, where only to allow the update to happen only if the value hasn't changed since last read: UPDATE ... SET ... WHERE id = ... AND content = "same old content". However this might fail if the database allows reading from old snapshots.
- Conflict resolution, as in replicated databases, techniques based on locks and compare-set doesn't apply, so one approach is to allow concurrent writes to create several conflicting versions, and let the application code to resolve (using last write wins) or merge them

Two other race conditions that can still happen are write skew and phantom reads.

Write skew is when two transactions are updating two different objects, yet their result is different than performing them serially. This can be fixed only through serializable isolation by configuring some constraints with triggers or materialized views as they involve multiple objects, or by explicitly lock the rows that the transaction depends on using FOR UPDATE.

Phantom reads occurs when, in the course of a transaction, new rows are added or removed by another transaction to the records being read, and there is no way to put locks on rows that might not be existing yet. This can be solved using materialized conflicts which is more like an artificial lock to the database. But, serializable isolation is always preferred over this approach.

## Serializability

Isolation levels are hard to understand, we cannot tell if an application code is safe just by looking, and there are no good tools to help with that. So, the simple solution is just to use serializable isolation, which is the strongest isolation level and prevents all race conditions.

Serializable isolation can be implemented through different techniques, actual serial execution, two phase locking, and optimistic concurrency.

The easiest is actual serial execution, which to actually execute only one transaction at a time on a single thread. This approach wasn't feasible until recently, as RAM become more cheaper, and database designers realized OLTP transactions usually makes a small number of reads and writes (in contrast with log-running analytical queries that should use snapshot isolation). Single thread execution can sometimes perform better than concurrent systems, however, the throughput is limited to single CPU.

To enhance the performance of serial executions, the application must submit the entire transaction code ahead of time as a stored procedure, which makes the performance reasonable, especially for databases with general-purpose programming languages. Partitioning can still be used with serial executions, especially when most transactions only uses one partition.

Two Phase Locking is similar to dirty writes, but with more stronger requirements on the lock, where two modes of locks are provided, shared mode for readers, and exclusive mode for writes. Deadlocks might result from multiple transaction holding locks, then the database automatically detects deadlocks and aborts one of the transactions.

The big downside of two-phase locking is the performance, which is much worse compared to weak isolation, also it can have unstable latencies, and can be very slow at high percentiles.

Serializable Snapshot Isolation (SSI) is an optimistic concurrency control technique that is fairly new but fast enough becoming the new default in the future. Instead of blocking if something potentially dangerous happens, transactions continue anyways, and the database checks for conflicts only when transaction commits, this reduces the number of unnecessary aborts. It perform badly if there is high contention, but this contention can be reduced with commutative atomic operations. Also, same as two phase locking, SSI can be partitioned and distributed which doesn't tie the performance to a single CPU core.

