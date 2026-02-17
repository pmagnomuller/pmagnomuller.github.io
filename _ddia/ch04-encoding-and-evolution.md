---
title: "DDIA Notes – Chapter 4: Encoding and Evolution"
chapter: 4
part: "Part I: Foundations of Data Systems"
collection: ddia
---

Chapter 4 is my mental note about how data formats and services keep changing while everything keeps running.

Chapter 4: Encoding and Evolution

Changes to the application's features also requires a change to data that it stores, this means that multiple versions of code and multiple data formats may coexist at the same time. Thus, backward compatibility and forward compatibility should be maintained.

## Formats of Encoding Data

Moving data between local memory and network requires encoding and decoding processes.

Language-specific encoding formats can be easier in decoding, however, it's usually tied for one programming language, it exposes the code to some security vulnerabilities, and it often have bad performance, so using JSON, XML, or Binary formats are usually better.

Binary encoding can save a lot of space for huge datasets, however it might be not worth the loss of human-readability for small ones.

Some binary encoding libraries (eg. Thrift, Protocol Buffers) come with code generation tools the produces schema classes given a schema. They can be more compact than textual data formats, and always have an up-to-date documentation.

## Models of Dataflow

The most common ways for dataflow between processes are using a database, service call (REST, RPC, etc.), or async message passing.

Dataflow through database is like the process is sending a future message to itself, it requires both backward compatibility and forward compatibility. A workaround the compatibility issue can be through rewriting the whole database into new schema every time it changes, however it's an expensive thing to do for large databases.

Similar to web dataflow paradigms, a server can act as a client to another service, the concept that led to service oriented architecture, where services are easier to change as they are independently deployable and evolvable.

Service calls dataflow only exposes specific apis, unlike database which can be queried for any available data. But again, we should expect old and new versions of services to run at the same time.

REST is a design philosophy that emphasizes simple data formats and uses URLs for identifying resources. SOAP on the other hand is an XML-based protocol for which clients can access a remote service using local classes and methods calls.

Remote Procedure Call (RPC) is a dataflow model that tries to make a request to a remote service looks like a local function call. However, it is flawed due to the difference between network call and local call:

- Network call is unpredictable, client would have to retry failed requests for example
- Network calls can return without a result due to a time out
- Retrying might cause an action to be performed twice (unless idempotence is used)
- Network latency is wildly variable
- Calling local function with memory reference might be hard to translate to a network call

REST seems to be the predominant style for public APIs, but RPC is often used on requests between services within the same datacenter.

RPC only needs backward compatibility on requests, and forward compatibility on responses.

When service is upgraded, it usually cannot force its clients to upgrade as well, but rather maintain multiple versions of APIs.

Async message passing requires an intermediary temporary storage called message broker or message queue. It has several advantages over RPC:

- It acts as a buffer when recipient is unavailable.
- It automatically retry sending the message to prevent it from being lost
- It avoids the sender the need to know the recipient's IP and port number
- One message can be sent to multiple recipients
- It decouples the sender from the receiver

One downside is that is is one-way communication, so for the recipient to reply it might have to use another channel.

Message brokers usually have one or more set of topics, and when a message is sent to a specific topic, the broker pass it all topic's subscribers. This creates a freedom for processes to publish messages to another topics upon receiving a message.

