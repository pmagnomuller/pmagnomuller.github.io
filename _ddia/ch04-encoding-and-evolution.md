---
title: "DDIA Chapter 4: Encoding and Evolution"
chapter: 4
part: "Part I: Foundations of Data Systems"
collection: ddia
---

- **Evolution**: Multiple code + data formats coexist → need **backward** and **forward** compatibility.

## Formats of Encoding Data

- **Language-specific**: Easy decode but tied to one language, security/performance issues → prefer JSON, XML, or binary.
- **Binary**: Saves space for large data; may lose human readability for small.
- **Thrift, Protocol Buffers**: Schema + codegen; compact, documented.

## Models of Dataflow

- **Database**: Like message to future self; needs both compatibilities. Rewriting whole DB to new schema is expensive.
- **Service calls**: Server can be client (SOA); independently deployable. Expose specific APIs only; old and new versions run together.
- **REST**: Simple formats, URLs for resources. **SOAP**: XML, remote as local methods.
- **RPC**: Remote call looks like local. **Problems**: Unpredictable, timeout without result, retry = double execution (use idempotent ops), variable latency, pointers don’t translate. REST for public APIs; RPC inside datacenter. RPC: backward compat on requests, forward on responses; maintain multiple API versions.
- **Async message passing**: Broker/queue. **Pros**: Buffer when recipient down, retries, sender doesn’t need recipient address, multicast, decoupling. **Cons**: One-way; reply needs another channel. **Topics**: Publish to topic → broker → all subscribers; can republish to other topics.
