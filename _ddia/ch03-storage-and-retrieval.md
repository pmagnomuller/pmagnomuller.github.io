---
title: "DDIA Chapter 3: Storage and Retrieval"
chapter: 3
part: "Part I: Foundations of Data Systems"
collection: ddia
---

## Data Structures That Powers Your Database

The simplest and best efficient write operation is simply appending to a file.

Databases doesn't usually index everything by default, but require us to choose indexes manually.

Hash Index is an in-memory key-value store that maps every key to its byte offset in the data file. New records are appended to a segment of certain size which is being merged and compacted by a background thread, allowing for old segments to be deleted. For reliability and concurrency, only one thread is used for writing, and a snapshot of segment's hash map is written to disk regularly.

Append-only logs allow faster sequential writes opposed to random writes, it have much simpler concurrency and crash recovery scenarios, and the merging mechanism avoids files getting fragmented over time. However, the hash table must fit in memory, and it doesn't support range queries.

Log-Structured Merge-Tree (LSM-Tree) uses a similar concept to the Hash Index, but rather using an in-memory balanced tree (eg. AVL, Red-Black) to keep records sorted. Writes are very fast as it is an append-only operations, while for reads it first checks the memory table, then the most recent file segment, then the next-older, and so on. If the database crashes, then the most recent writes are lost, to avoid that, every write is immediately appended to secondary disk log file.

LSM-Trees provides a segment merging mechanism that is simple and efficient, it no longer need to keep and index for all keys in memory (thanks to sorting), and it is possible to group and compress records before writing to disk. However it can be very slow when looking for keys that doesn't exist (A bloom filter might help with that).

B-Tree index is the most widely used indexing structure. It's the standard index for almost all relational databases. It breaks the database down into fixed-size pages (4 KB in size) which is the same size as the disk's page.

B-Tree is balanced, so n keys always have depth of O(log n). It also have a branching factor of several hundreds typically.

B-Trees implement crash resilience mechanism by having an append-only log file in the disk, and handle concurrency by using latches.

Some optimizations to B-Trees include writing modified page to different location with the parent pointing to the new location, storing an abbreviation of the key to save space, and referencing sibling nodes in the leaf layer.

### Advantages of LSM-Trees over B-Trees:

- Faster writes
- Higher write throughput
- Compresses better
- Lower write amplification

### Disadvantages for LSM-Trees over B-Trees:

- Slower reads
- Compaction process might interfere with the overall performance
- Performance is less predictable
- Disk bandwidth can be easily consumed
- Un-merged segments might keep growing until filling up the disk space
- Same key might exist in multiple segments

In addition to primary key index, databases can have non-unique secondary indexes, that are often crucial for joins in relational databases. Both B-Trees and LSM-Trees can have secondary indexes.

Storing all row data within the index (clustered index) can allow some queries to be answered using index alone.

Multi-column indexes are helpful in querying several columns at once (eg. Geo-spatial data) as it appends several fields as one key. Standard B-Trees or LSM-Trees cannot answer such queries but they rather convert multi-dimensions into one value.

Fuzzy indexes can help in querying similar keys when the exact key is unknown, it's useful in document classification and machine learning.

In-memory databases are much faster but less durable and more expensive. It thus needs to write to disk asynchronously in case it had to restart. It is great for small datasets, and for modeling complex data models (eg. queues, sets)

## Transaction Processing or Analytics?

Businesses usually have two types databases, online transaction processing (OLTP) for every-day transactions, and online analytic processing for analytics purposes (Also known as Data Warehouse).

Data Warehouse's goal is to provide the same data in the transaction processing database, for business analytics and data science engineers to use without affecting the performance of the transaction database. This happens either through periodic data dump, or continuous stream of updates. In both cases the data is transformed first before being loaded in the warehouse.

Big advantage of having a separate warehouse is that it can be optimized for analytic access patterns, specially that typical OLTP indexing engines don't perform well in the case of analytic queries, but it's usually relational because SQL is good for analytic queries.

## Column-Oriented Storage

Typical data warehouse tables are very wide, and typical warehouse queries only access few of them at a time. So instead of storing each row's data together, it is more efficient to store each column's data together. This can work for both relational and non-relational models.

Column-based datastores can benefit of data repetition by compression, and from CPU cycles by vectorized processing, but this makes writes more difficult (eg. in-place update is not possible). We can solve this by using in-memory structure same as LSM-Trees, which sorted and accumulated before it's written to disk.

A helpful technique for data warehouse is materialized aggregates, which caches some of the aggregated data that are used most often. In relational model, this can be created using materialized views.

