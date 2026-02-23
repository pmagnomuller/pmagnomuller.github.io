---
title: "DDIA Chapter 11: Stream Processing"
chapter: 11
part: "Part III: Derived Data"
collection: ddia
---

- **Vs batch**: Batch = read all first, output delayed (days). **Stream** = small chunks, sub-second; unbounded input.
- **Stream** = sequence of events (small, immutable, timestamped). **Topic** = group of related events. DB can connect producers/consumers but polling is costly ⇒ messaging systems.
- **Messaging**: Many producers/consumers per topic. **Backpressure**: Drop, buffer, or block. **Durability**: Disk + replication ⇒ lower throughput, higher latency.
- **Options**: **Direct** (UDP, broker-less, HTTP/RPC) ⇒ app handles loss. **Broker/queue**: Buffer, retry, hide recipient; delete after delivery; subscribe to topics; distribute or fan-out. **Log-based brokers**: Durable + low latency; high throughput, partition, fault-tolerant; for stream processing and derived state/streams.
- **When to use**: Log-based = high throughput, fast, ordering matters. JMS/AMQP = expensive processing, parallelization.

## Database as Stream / CDC & Event Sourcing

- **DB as stream**: Event = write; capture, store, process. **Sync**: Dual writes ⇒ races, need atomicity. **CDC**: Observe DB changes, extract, replicate (e.g. to search index); DB = leader; parse replication log; snapshots + log compaction. **Event sourcing**: Store commands (actions), not effects; chain new side effects; app logs + deterministic derivation; needs compaction.
- **Immutability**: Mutable state + append-only log compatible; easier debugging, history, evolution; read/write forms separate ⇒ multiple views. **Downside**: Async consumers ⇒ read-your-writes can fail; fix: sync read view or linearizable (total order broadcast); same partition for log and state ⇒ no concurrency control. **Limits**: History growth; deletion hard.
- **Processing**: Write to store (query later), push to users, or produce another stream. Like batch: read-only input, append-only output; but stream never ends ⇒ no global sort; restart different from batch. **Use**: Monitoring, fraud, markets, machines. **CEP**: Long-lived queries matched to stream.

## Windows & Time

- **Window** = time interval for aggregation. System clock breaks with lag. **Problem**: Don’t know if more events for window will arrive. **Solution**: Timeout after no events ⇒ ignore stragglers or publish correction.
- **Timestamps**: Log **event time**, **send time**, **receive time** ⇒ estimate device–server clock offset.
- **Window types**: **Tumbling** (fixed, each event in one); **hopping** (fixed, overlapping); **sliding** (interval, overlapping); **session** (no fixed length, events close in time).
- **Joins**: Stream–stream, stream–table, table–table. Processor keeps state from one side, queries on other; **ordering** and **version IDs** matter.
- **Fault tolerance**: Stream as small batches (~1 s); atomic commits to avoid double effects; amortize with multi-message transactions. **Idempotent writes**: Same effect if repeated; any op can be made idempotent with metadata.
