---
title: "Clean Code Chapter 13: Concurrency"
chapter: 13
part: "Principles"
collection: cleancode
---

## Core ideas

Concurrency is its own design concern. Mixing it into ordinary business logic hides races.

- Keep concurrent code separate and minimal
- Know shared data; prefer immutability and isolation
- Limit synchronized/locked scope
- Understand the execution model (threads, pools, actors, events)
- Copy on the way out of a boundary when it simplifies reasoning
- Stress-test for races; failures are often intermittent

## Picture

```mermaid
flowchart LR
  Req[Requests] --> Pool[Thread pool]
  Pool --> Pure[Pure domain work]
  Pure --> Shared[(Shared state)]
  Shared --> Lock[Narrow critical section]
```

## Java

### Shared mutable state

```java
public class Counter {
  private int value;

  public void increment() { // race
    value++;
  }
}
```

### Safer approaches

```java
public final class Counter {
  private final AtomicInteger value = new AtomicInteger();

  public void increment() {
    value.incrementAndGet();
  }

  public int get() {
    return value.get();
  }
}

// Or confine mutation to one thread / actor and pass immutable messages.
```

### Separate concurrency policy from work

```java
public final class OrderProcessor {
  public void process(Order order) {
    // pure domain — no threads here
  }
}

ExecutorService pool = Executors.newFixedThreadPool(8);
pool.submit(() -> processor.process(order));
```

## Takeaways

- Correct single-threaded design first
- Introduce concurrency deliberately with clear ownership
- Test under load; luck is not a strategy
