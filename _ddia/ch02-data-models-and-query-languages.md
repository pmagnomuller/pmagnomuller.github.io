---
title: "DDIA Chapter 2: Data Models and Query Languages"
chapter: 2
part: "Part I: Foundations of Data Systems"
collection: ddia
---

## Data Models

Data models are perhaps the most important part of developing software, because they have such a profound effect on the way we think about the problems we're solving.

Relational model is the best known data model today, because of the way it hides the implementation details behind a cleaner interface. It turned out to generalize very well when computers were used for increasingly diverse purposes.

NoSQL databases have been adopted quickly and easily because:

- It provided a better scaling mechanism, including very high write throughput than relational databases
- It was free and open source
- It supported few specific query operations better than relational databases
- It provided more dynamic and expressive data model than relational databases

Relational databases will continue to be used alongside a broad variety of non-relational datastores (Polyglot Persistence).

Relational databases receives common criticism as an awkward translation layer is required between the application code objects, and the database model. ORM frameworks reduce the overhead but they don't eliminate it.

Relational databases deal with the one-to-many relationship in one of three ways:

- The common normalized way is to put the many values in a separate table, with foreign key reference to the one.
- Later versions of SQL allowed multi-valued data be stored in a single row, with support for querying inside them.
- The least favorable option is to store them as encoded JSON or XML, and let the application do the internal query.

Document-oriented databases on the other hand supports one-to-many relationship natively, and provides better locality for the data object, thanks to the self-contained nature of JSON.

Having standardized lists for users to choose from rather than plain typing is easier for updating, better for styling consistency, better for localization support, and easier for searching. This standardized lists should be using an underlying IDs for the values, as anything that is meaningful to humans may need to change sometime in the future.

Relational databases deal with many-to-one relationship by referring to rows in tables by ID, as joins are easy. However, Document databases doesn't nicely support many-to-one relationships. Instead, the application code would need to go through the overhead of simulating the join itself, which can cache it all in memory if it's small and slow-changing.

Relational databases overpowered older models such as hierarchical model and network model on the long run, thanks to the query optimizer that made it easier for relational model to add new features to the applications.

When comparing document model to relational model, arguments in favor of document model are schema flexibility, better performance, and more-matching data structure with the application, while Relational model provides better support for joins, and many-to-one and many-to-many relationships.

Document databases are not schemaless, but rather have schema on read in oppose to relational model's schema on write. It is not enforced by the database, but more easier to change and modify.

For document databases to benefit from locality, documents have to be relatively small in size.

A hybrid of relational and document models might be the future of databases, as they are becoming more similar over time.

## Query Languages

SQL is attractive to people due to its declarative nature, it specifies the pattern of the resulted data instead of the way of querying it. Also, declarative code is easier to parallelize across multiple machines.

MapReduce is fairly low-level programming model for distributed execution, but it doesn't have a monopoly on distributed query execution.

Graph data model is usually the most suitable model for data with a lot of many-to-many relationships. There are many well-known algorithms which can operate on graphs, and some good declarative query languages such as Cypher for efficient querying.

Graph data model is different from network model in the way it gives much greater flexibility for applications to adapt.

