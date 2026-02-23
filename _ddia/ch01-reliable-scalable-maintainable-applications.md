---
title: "DDIA Chapter 1: Reliable, Scalable, and Maintainable Applications"
chapter: 1
part: "Part I: Foundations of Data Systems"
collection: ddia
---

- **Limiting factor**: Usually data size, not CPU.
- **Goals**: Keep data correct & complete; good performance; scale under load; tolerate failures.

## Reliability

- **Fault** = one component deviating from specs. **Failure** = whole system stops. Prevent faults → failures via fault-tolerance.
- **Hardware**: Redundancy first; then software fault tolerance for loss of entire machines.
- **Software faults**: Wrong assumptions about environment. No quick fix; software can self-check for discrepancies.
- **Reliable systems despite humans**:
  - Minimal, focused abstractions (not too restrictive).
  - Sandbox with real data, no impact on users.
  - Test at all levels (unit → integration).
  - Fast rollback + tools to recompute data.
  - Monitoring with early warning signals.

## Scalability

- **Load parameters**: Define first (e.g. requests/sec, read/write ratio).
- **Metrics**: Batch → throughput. Online → response time.
- **Percentiles**: Xth % = Y ms ⇒ X% of requests better than Y ms. Optimize high percentiles (slow users often have most data); don’t over-optimize (e.g. 99.999th).
- **Measure** response time on client, under realistic load.
- **Elastic** = good for unpredictable load; **manual** scaling = simpler, fewer surprises.
- **Startups**: Iterate on features first; don’t over-scale for hypothetical load.

## Maintainability

- **Operability**: Routine tasks easy → monitoring, no single-machine dependency, docs, good defaults + overrides, self-healing + manual control.
- **Simplicity**: Reduce complexity via abstractions (not by cutting features).
- **Evolvability**: Easy to adapt; Agile helps.
