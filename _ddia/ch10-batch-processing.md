---
title: "DDIA Chapter 10: Batch Processing"
chapter: 10
part: "Part III: Derived Data"
collection: ddia
---

- **Three system types**: **Services** (online, request/response); **Batch** (offline, bounded input, periodic, can take days); **Stream** (near real-time, unbounded input).
- **Unix tools**: awk, sed, grep, sort, uniq, xargs for quick analysis. **Why they work**: Same I/O (files + pipes), immutable input, stop pipeline anywhere, intermediate files for fault tolerance. **Limit**: Single machine ⇒ Hadoop etc.

## MapReduce & Distributed FS

- **MapReduce**: Doesn’t modify input; distributed; reads/writes distributed FS (e.g. HDFS). **Mapper**: One call per record → key-value(s). **Reducer**: Same key → aggregate → output. No randomness; one job limited ⇒ chain jobs (directories).
- **Joins**: No indexes; read full data. Network join = slow + inconsistent. Better: copy DB into distributed system. **Types**: Sort-merge, broadcast hash, partitioned hash.
- **Index building**: MapReduce good for Lucene/Solr full-text. **Output**: Often a DB; don’t write from mapper/reducer to DB; build DB in job, write files to FS.
- **Unix-like**: Rollback = re-run same output; fast iteration; transparent retries; separation of concerns; same files for many jobs. **Data lake**: Dump raw to FS; clean/transform later for warehouse/services. MapReduce for large, long, failure-prone jobs.

## Beyond MapReduce

- **Fully materialized**: Eager write of intermediates; no job starts until predecessors done; redundant mappers; replication cost.
- **Dataflow engines** (Spark, Flink, etc.): One job = whole workflow; richer ops than map/reduce; faster. **Trade-off**: No materialization ⇒ recompute on failure; bad for small or CPU-heavy.
- **High-level** (Hive, Pig): Less code, interactive, better execution. **Batch advantage**: Arbitrary code in callbacks (e.g. ML, stats, spatial).
