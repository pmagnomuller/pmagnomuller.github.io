---
title: "DDIA Chapter 2: Data Models and Query Languages"
chapter: 2
part: "Part I: Foundations of Data Systems"
collection: ddia
---

## Data Models

- Data models shape how we think about the problem. **Relational model**: hides implementation, generalizes well; dominant today.
- **NoSQL adoption**: better scaling & write throughput, OSS, good for specific queries, more flexible/expressive models. **Polyglot persistence** = relational + non-relational together.
- **ORM**: Reduces but doesn’t remove application–DB impedance.

**One-to-many (relational)**:
- Normalize: separate table + FK.
- Multi-valued in one row (later SQL).
- JSON/XML in row, app does internal query (least favored).

**Document DBs**: Native one-to-many, better locality (self-contained JSON). Use **IDs** for standardized lists (not human-readable labels).

**Many-to-one**: Relational = easy (joins by ID). Document = app must simulate join (e.g. cache if small/slow-changing).

**Document vs relational**:
- Document: schema flexibility, performance, structure matches app; **schema on read** (not schemaless), easier to change.
- Relational: joins, many-to-one, many-to-many. Locality in documents needs small docs.
- **Future**: Hybrid as models converge.

## Query Languages

- **SQL**: Declarative (what, not how); easier to parallelize.
- **MapReduce**: Low-level for distributed execution; not the only option.
- **Graph model**: Best for many-to-many; algorithms + declarative languages (e.g. Cypher). More flexible than old network model.
