---
title: Semantic data
description: What semantic data is and what it takes to build it.
---

A model knows only what it learned in training, so the organization's **data**, such as its documents and records, has to reach it through the **context**, everything that it gets for a task. Finding the right data for a task is called **retrieval**, and adding it to the context so the model can respond with it is **retrieval-augmented generation (RAG)**.

**Semantic data** is data that agents can find by its meaning, rather than by exact words or by table and column names. It relies on a **data pipeline** that prepares a copy of it and on three ways to find it: **semantic search** that matches documents to a question, a **semantic layer** that applies business definitions to records, and a **knowledge graph** that links things, such as suppliers and products.

:::tip[Takeaways]

- **Set content ownership.** Only the organization can decide which content is correct and what it means, so each source needs an owner.
- **Propagate permissions.** A copy without the permissions of its source can show anyone what only some may see.

:::

## Data pipelines

A **data pipeline** runs **ETL**: it extracts data from source systems, transforms it for retrieval, and loads the copy into a store. The same approach loads records into a data warehouse, and those pipelines often exist already, so the new work is usually in documents.

1. **Extract.** The pipeline reads documents from source systems together with their **metadata**, such as the title, owner, date, and permissions, so that search can filter by it and answers can name their source. Sources that outsiders can write to, such as support tickets, need caution, because their text can carry instructions that the model may follow.
2. **Transform.** The pipeline turns documents into plain text, splits the text into **chunks**, parts short enough to be found and read on their own, and turns each into an **embedding**, a numeric representation of its meaning, with a specialized **embedding model**. Chunk size is a balance: a chunk that is too short loses the surrounding text that explains it, and one that is too long mixes topics, so its embedding matches none of them well.
3. **Load.** The pipeline writes chunks, embeddings, and metadata to a **vector store**, a database that can compare embeddings. It can be a separate product or an extension of an existing database. Later runs update changed documents and remove deleted ones. Embeddings from different models cannot be compared, so a new embedding model means embedding and loading everything again.

A data pipeline creates a new copy of the data, separate from its sources: their permissions do not protect it, and their changes do not reach it on their own. For security, each chunk keeps the permissions of its document as metadata for search to apply. Where permissions cannot be kept, it is safer to copy only what everyone who can search may see. The embedding model and the vector store also receive the data, so they have to meet the same rules for where it may be processed and kept. For reliability, each chunk also keeps its **provenance**, a record of where it came from, such as the source and date, and its **ownership**, who is responsible for the content, so answers can be checked and errors fixed in the source. For operations, regular runs keep the copy and its permissions current, deletions and retention rules remove chunks, and monitoring catches failed runs, which are easy to miss because search keeps working on the old copy.

A reference product is [Docling](https://docling.ai/), which turns documents into text and chunks for an existing pipeline.

## Semantic search

**Semantic search** finds the chunks that are closest in meaning to a question. It usually returns the closest chunks even when none of them holds the answer, so finding them is only the first step.

1. **Match.** The search turns the question into an embedding and compares it with those of the chunks, so both have to come from the same embedding model. This is fast even on large collections, but embeddings handle exact terms, such as error codes or contract numbers, poorly.
2. **Filter.** The search matches only chunks with the right metadata. Most vector stores can filter, but permissions take more: the search has to know who asks and which groups they belong to, usually from the organization's identity system. Permissions cannot be left to instructions, because whatever is in the context can end up in the response.
3. **Rank.** A close chunk can be on the topic without answering the question. A **reranker**, another specialized model, reads the question together with each chunk and orders the chunks by **relevance**, how well they answer it. This improves quality but is slow, so it runs only on the chunks that matching returned. Chunks that are not relevant enough are left out, even if none remain, so the model can say that it has no answer.

In basic RAG, one search runs before the model responds. **Hybrid search** adds a keyword search, which finds exact words, and combines both results. In **agentic search**, the model decides what to look for and when to search again, which finds more but takes more steps. A **semantic cache** uses matching for another purpose: it reuses a past answer when a similar question comes, which saves a request, but a similar question can need a different answer, and the past answer can hold what the person asking now may not see.

A reference product is [Qdrant](https://qdrant.tech/), which covers matching and filtering and works with rerankers, while permissions are left to the application.

## Semantic layers

A **semantic layer** stands between the model and the databases, usually a data warehouse. It offers business terms for the model to choose from and calculates numbers from their definitions. Without it, the model has to guess the meaning of tables and columns, so the same question can get different numbers.

1. **Definitions.** A **dataset** is data that the layer covers, such as orders or customers, and **relations** connect datasets, such as each order to its customer. A **metric** is a number calculated from them, such as net revenue, and a **dimension** is a property to split or narrow it by, such as region or month. Descriptions and synonyms tell the model that "sales" means net revenue. Each definition needs ownership.
2. **Queries.** A query asks for metrics and dimensions, such as net revenue by month in one region. The layer calculates it from the definitions, so the same query is always calculated the same way. The layer answers only what is defined, so its coverage grows with the definitions. The model can still pick the wrong metric, such as gross revenue instead of net, so answers should name the metrics behind them.
3. **Permissions.** The layer filters data itself, by rules that depend on who asks. Rules on rows decide which records count, so a regional manager gets the numbers of one region, and rules on columns hide fields such as salaries. The rules are kept in the layer or in the data platform that stores the data, and they apply to every query, so the model cannot skip them. With one shared account, though, everyone gets what that account can see.

A semantic layer can be part of a reporting tool, part of a data platform, or a separate product over several of them. Most offer tools to agents through MCP servers, and the approaches differ in who builds the query. With **named metrics**, the model picks metrics and dimensions by name, and the layer builds the query, which gives the most control but needs every metric defined first. With a **query language**, the model builds the query over the definitions, which is more flexible but easier to get wrong. With **question and answer**, the layer's own agent takes the question and builds the query, which is the simplest to use but hides how it chose the metrics. The alternative to a semantic layer is **text-to-SQL**, where the model writes database queries on its own: it can try any question, but a wrong number can look right.

The cost is delay: a question outside the definitions waits until departments agree on new ones.

A reference product is [WrenAI](https://www.getwren.ai/), which gives agents definitions and queries over MCP, while permissions take its paid edition.

## Knowledge graphs

A **knowledge graph** stores facts as things and the links between them, so one answer can draw on several systems. It pays off for questions that take several links, which separate searches can miss.

1. **Ontology.** An **ontology** lists the kinds of things, such as customers and orders, the links allowed between them, and the rules they follow. This gives them one meaning across systems: customers in sales and accounts in billing become one kind of thing. It can start small, with the things that the most valuable questions need. Departments have to share one ontology, and it changes as the business does, so it needs ownership.
2. **Facts.** An ETL pipeline usually fills the graph with facts, such as one customer placing one order. Records are mapped to the ontology through their identifiers. Documents need a model to extract facts, which can produce wrong ones. **Entity resolution** matches the same thing, or entity, across sources, such as one company listed under two names: a missed match hides links, and a wrong one connects things that have nothing in common.
3. **Queries.** A query follows links from one thing to the next, which is called **traversal**, such as from a supplier to its products and their orders. The links followed can be shown with the answer, so people can check it. Permissions on things and links decide what each person or agent can follow, but a graph that copies its sources does not inherit their permissions. Results grow with every link, so queries need a limit on how far they go.

Approaches to knowledge graphs differ in how the facts get in. With **GraphRAG**, a model extracts them from documents, and the search follows links from the matching chunks, which takes the least work from people but leaves the facts unchecked. With a **graph database**, a pipeline loads them, and the model explores them by writing its own queries, which is the most flexible but leaves the ontology and the facts to the team. With an **ontology platform**, the ontology is mapped to existing data and can come with actions, such as approving an order, which suits business processes but ties the organization to the platform.

A reference product is [Neo4j](https://neo4j.com/), which covers facts and queries, while permissions take its paid edition.
