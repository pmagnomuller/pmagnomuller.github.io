---
title: "DDIA Chapter 10: Batch Processing"
chapter: 10
part: "Part III: Derived Data"
collection: ddia
---

All systems can fit into three main categories:

- Services (online), where it waits for requests, tries to handle them as quickly as possible, and sends back a response.
- Batch Processing Systems (offline), where it runs a job to process a large amount of bounded input, and produce some output data. It is often scheduled periodically, and can take up to several days as no user is typically waiting for it to finish.
- Stream Processing Systems (near-real-time), where is consumes unbounded input shortly after its available, processes it, and produces output.

## Batch Processing with Unix Tools

Many data analysis can be done in few minutes using some combination of Unix commands awk, sed, grep, sort, uniq, and xargs.

Unix shell lets us easily compose these small programs (commands) into powerful data processing jobs, for this to happen, all these programs should have the same input/output interface. In Unix, this interface is a just a file. And with the help of pipes, these files can be treated as a sequence of bytes flowing from one program to another.

Reasons that Unix tools are so successful includes that the input files are treated as immutable, we can end the pipeline are any point, and we can write the output of intermediate stages to files for fault-tolerance.

The biggest limitation of Unix tools is that it can only run on a single machine, that's where tools like Hadoop come in.

## MapReduce and Distributed File Systems

Same as Unix tools, MapReduce job doesn't modify the input, but it can be distributed across thousands of machines, and instead of using local file system, it reads and writes to distributed file system (eg. HDFS).

To create a MapReduce job, we need to implement a mapper callback function, which is called once for every input record and has the job of extracting key-value pair(s) from the record, and a reducer callback function, that collects all the values belonging to the same key, and use them to produce a number of output records, which is configured by the user.

MapReduce jobs cannot have any randomness, and the range of problems we can solve with single MapReduce job is limited, so commonly jobs are chained together to form a workflow, which is done implicitly using directory names.

Joins are necessary whenever we need to access records on both sides of an association, but MapReduce has no concept of indexes to help in the join operation, it reads the entire content of the file. One solution is to query the file needed for join over the network, however such an approach is most likely to suffer from poor performance, and also can lead to inconsistency if the data changes over the time of round-trip. So, a better approach would be to clone the other database into the distributed system.

MapReduce can perform joins through several ways, such as sort-merge joins, broadcast hash joins, and partitioned hash joins.

Google initially used MapReduce to build the index of its search engine, and even though it later moved away from it, MapReduce reamins a good way of building indexes for Lucene/Solr, as it's effective in performing full-text search.

The output of batch jobs are often some kind of database, and having a client library inside the mapper or reducer to write to a database can be a bad idea for many reasons, instead, we can build a new database inside the batch job, and write its files to the distributed file system.

The Unix-like philosophy in MapReduce has many advantages, as we can simply rollback any changes with the guarantee of the producing the same output when the job runs again, feature development can proceed more quickly, it transparently retries failed tasks without affecting the application logic, it provides a separation of concerns, and the same set of files can be used as inputs for different jobs.

Distributed file systems open the possibility of dumping data in file systems, and making data available quickly even if it was in raw format, which can then be consumed by Data Warehouses or other services after it is cleaned up and transformed.

MapReduce approach is more appropriate for large jobs that takes a long time, and likely to experience at least one failure.

## Beyond MapReduce

MapReduce's approach is fully materialized, which means to eagerly compute results of some operations and write them out rather than computing them on demand. This prevents any job from starting until all its preceding jobs are completed, mappers are often redundant, and this extra intermediate storage have to be replicated which wastes a lot of resources.

MapReduce also has some other limitations apart from materialization, where implementing complex job using the raw MapReduce APIs is quite hard, and it provides poor performance for some kind of processing.

Dataflow engines (eg. Spark, Tex, Flink, etc.) overcome MapReduce disadvantages by handling and entire workflow as one job, rather than small independent sub-jobs. It also provides more flexible callback functions (operations) rather than only map and reduce.

We can use dataflow engines to implement the same computations as MapReduce, but it executes significantly faster. However, because they dismiss the intermediate materialization, they have to to recompute most of the data when the job fails. However, the re-computation overhead of dataflow engines makes it challenging to use it with small data or CPU-intensive computations, so materialization would be cheaper.

Higher-level languages and APIs (eg. Hive, Pig) has the advantages of requiring less code, while also allowing interactive use. Moreover, it also improves the job execution efficiency at the machine level.

One of the biggest advantages of batch processing jobs compared to typical databases, is the freedom of writing arbitrary code inside the callback functions, which is usually in high level languages.

Batch processing has an increasingly important applications in statistical and numerical algorithms, machine learning, recommendation systems, and computing spatial algorithms as well.

