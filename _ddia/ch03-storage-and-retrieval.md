---
title: "DDIA Chapter 3: Storage and Retrieval"
chapter: 3
part: "Part I: Foundations of Data Systems"
collection: ddia
---

## Data Structures That Power Your Database

- **Best write**: append to file. DBs don’t index everything by default.
- **Hash index**: In-memory key → byte offset. Segments merged/compacted in background. Single writer; snapshot hash to disk. **Pros**: fast sequential writes, simple concurrency/recovery, no fragmentation. **Cons**: must fit in memory, no range queries.
- **LSM-tree**: In-memory sorted structure (e.g. AVL, red-black). Append-only writes; read path: memtable → newest segment → older. WAL for crash recovery.
  - **Pros**: merge is simple; no full key index in memory (sorting); can compress. **Cons**: slow for non-existent keys (bloom filter helps).
- **B-tree**: Fixed-size pages (e.g. 4 KB), balanced O(log n), high branching factor. Crash resilience via WAL; concurrency via latches. Optimizations: copy-on-write pages, key abbreviation, sibling pointers.
- **LSM vs B-tree**: LSM = faster writes, better compression, lower write amplification; B-tree = faster reads, more predictable, no compaction interference. LSM downsides: compaction cost, less predictable, disk bandwidth, unmerged growth, duplicate keys across segments.
- **Secondary indexes**: Non-unique; both B-tree and LSM support. **Clustered index** = row in index → index-only queries. **Multi-column** = concatenate fields (e.g. geo). **Fuzzy** = similar keys (ML, classification).
- **In-memory DBs**: Faster, less durable, costlier; async to disk for restart; good for small data, queues/sets.

## OLTP vs Analytics (Data Warehouse)

- **OLTP**: Day-to-day transactions. **OLAP / Data warehouse**: Same data for analytics, no OLTP impact; ETL from dump or stream.
- **Warehouse**: Optimized for analytics (OLTP indexes poor for analytics); usually relational (SQL).

## Column-Oriented Storage

- Store by **column** not row (few columns per query). Good for relational and non-relational.
- **Benefits**: Compression (repetition), vectorized CPU. **Cost**: Harder writes (no in-place update); use LSM-like in-memory then flush.
- **Materialized aggregates / views**: Cache common aggregations.
