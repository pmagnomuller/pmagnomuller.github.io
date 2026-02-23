---
title: "DDIA Chapter 11: Stream Processing"
chapter: 11
part: "Part III: Derived Data"
collection: ddia
---

Some problems of batch processing are that it has to read the entire input before processing, and that the input is reflected to output after a very long period (up to days sometimes), stream processing come into place as a solution for these two problems, where processing is run over small chunks of input for a very small time frames (usually less than a second).

## Transmitting Event Streams

Stream is usually a sequence of events: a small, self-contained, immutable objects with a timestamp. Related events are usually grouped together into a topic.

A database is sufficient to connect producers and consumers. However, continuous polling is expensive, so its better for consumers to be notified when new events appear, the behavior that usually requires specialized tools such as messaging systems.

Messaging systems allows multiple producers nodes to send messages to the same topic and allows multiple consumer nodes to receive messages in a topic.

When a producer sends messages faster than the consumer can process, consumers can either drop the messages, buffer them in a queue, or block the producer from sending more messages. And for durability, a combination of writing messages to disk and having replication might be used, but with a cost of lower throughput and higher latency.

One option for a messaging systems is direct network communication, such as UDP multi-cast, broker-less messaging libraries, or direct HTTP or RPC requests. However, their biggest drawback is that they require applications to be aware of loss possibility.

Another more widely used option is communication via a message broker or message queue, which acts as a server that both producers and consumers connects to, it automatically deletes a message after delivery, it supports some way of subscribing to a subset of topics, and it notifies clients when data changes. Message Broker can decide to distribute the event load among consumers, or deliver all messages to all consumers, or a combination of both.

A variation of message brokers called log-based brokers, uses a combination of the durable storage approach of databases, and the low-latency notification facilities of messaging. It is able to achieve high throughput while partitioning across multiple machines, and providing fault tolerance. It is appropriate for stream processing systems that consume input streams and generate derived state or derived output streams.

Log-based messages brokers are suitable in situations with high message throughput, fast processing, and when message ordering is important, while typical JMS/AMQP brokers are typically used when messages are expensive to process, and parallelization is needed.

## Database and Streams

A database can be represented as a stream, where an event can be something that was written to a database, it can be captured, stored, and processed. This representation opens up powerful opportunities for integrating systems.

As the same data appears in several different places, they need to be kept in sync. One option is to use dual writes, however, unless there is a good concurrency detection mechanism, it might cause race conditions, and it also requires atomic commits.

A better approach for data sync is change data capture (CDC), which is the process of observing all data changes written to a database and extracting them in a form in which they can be replicated to other systems (eg. search index). It allows the database to act as a leader to other followers. It is usually implemented by parsing the replication log of the database, which relies on taking consistent snapshots regularly and log compaction to avoid running out of space. a Another approach similar to CDC is event sourcing, which records the user's actions (commands) as immutable events rather than the effects of the action. It allows that new side effects easily be chained off the existing events, but it also requires the application to log events and transform it deterministically into application state, thus requiring log compaction as well.

What makes both CDC and event sourcing powerful is the principle of immutability. especially that mutable state and append-only log of immutable events don't contradict each other. This makes it easier to diagnose bugs, help capture more information than just the current state, and makes it easier to evolve the application over time. Also we gain a great flexibility by separating the form of writing from the form of reading data, thus, allowing multiple read views.

The biggest downside of CDC and event sourcing is that the consumers of the event log are usually asynchronous, which might lead to failure in reading your own writes. One solution is perform updates on read view synchronously, but a better approach might be to implement linearizable storage using total order broadcast. However, if the event log and application state are partitioned in the same way, then a single-threaded log consumer needs no concurrency control for writes.

The limitations of immutability is that immutable history may grow very large, causing the system to perform poorly. Also, for administrative reasons, data must be completely deleted in some cases, which is surprisingly hard.

## Processing Streams

A stream can be processed in three ways, either write it to a datastore (eg. database, cache, search index) which can be queried by the clients later, push it as an event to the users, or process it and produce another output stream.

Stream processing acts like batch processing in the way that is consumes input in read-only fashion, and writes output in append-only fashion. However, streams never ends, so operations such as sorting becomes impossible. Also, restarting a failed job is not an option.

Stream Processing is useful in monitoring systems such as fraud detection, financial markets, and factory machines status.

Complex event processing (CEP) is an approach that stores queries in the long-term, and try to continuously match it with input streams.

Analytics are usually aggregated over a period of time, this time interval is known as window. Many stream processing frameworks use the local system clock for determining windowing, but it breaks down if there is any significant processing lag. So usually

The problem with defining the window interval, is that we can never be sure whether some events are still to come or not. Usually, this is solved by a timeout after not seeing any new events for a while, and then either ignore any straggler event, or publish a correction for it.

For events to have a reliable timestamp, we have to log three timestamps: the event occurrence time, the event sending time, the event receiving time. This three timestamps can help in estimating the offset between the device clock and server clock.

There are four types of windows:

- Trumbling window: which has a fixed length, and every event belong to exactly one window
- Hopping window: which has a fixed length, but allow windows overlap
- Sliding window: which contain all events that fits in any some interval, and allows overlapping by definition
- Session window: which has no fixed duration, but contains events that occur closely together in time

Same as batch processing, stream processing needs to do joins, either by joining a stream to another stream , or a stream to a table, or two tables. The three types of joins requires the stream processor to maintain some state based on the join input, and a query that state on messages from the other join, which makes the ordering guarantees an important matter, and it is often addressed by using a unique identifier for a particular version of the joined record.

In order to provide fault-tolerance to stream processing, we might want to break the stream into small blocks, and treat each block as a batch (batch size is typically around a second). Also, atomic commits might be necessary to avoid causing side effects twice, and luckily, the overhead of transaction protocols can be amortized by processing several messages within a single transaction.

An alternative for transactions is idempotence writes, which are operations that can be performed multiple times and still has the effect as if it was performed once. Any operation can be made idempotent with some extra metadata.

