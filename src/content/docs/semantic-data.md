---
title: Semantic data
description: What semantic data is and what it takes to build it.
---

A model knows only what it learned in training, so the organization's **data**, such as its documents and records, has to reach it through the **context**, everything that it gets for a task. Finding the right data for a task is called **retrieval**, and adding it to the context so the model can respond with it is **retrieval-augmented generation (RAG)**.

**Semantic data** is data that agents can find by its meaning, rather than by exact words or by table and column names. It relies on three ways to find it: **semantic search** that indexes documents and matches them to a question, a **semantic layer** that applies business definitions to records, and a **knowledge graph** that links things, such as suppliers and products.

With **agentic retrieval**, the agent gets these ways to find data as tools, usually through MCP servers, and the model decides which to use, what to ask, and when to look again. It finds more than a single lookup, but takes more steps and tokens. Each tool runs under the agent's identity, its own or a user's, which decides what it may find.

:::tip[Takeaways]

- **Set ownership.** Only the organization can decide which content is correct and what it means, so each source needs an owner.
- **Propagate permissions.** A copy without the permissions of its source can show anyone what only some may see.

:::

## Semantic search

**Semantic search** finds the parts of documents that are closest in meaning to a question, in a copy of them prepared ahead of time. It usually returns the closest parts even when none of them holds the answer, so finding them is not enough.

1. **Index.** A **data pipeline** prepares the copy: it reads documents from source systems with their **metadata**, such as the title, owner, date, and permissions, turns them into plain text, and splits the text into **chunks**, parts that can be found and read on their own. A specialized **embedding model** turns each chunk into an **embedding**, a numeric representation of its meaning, and the pipeline loads chunks, embeddings, and metadata into a **vector store**, a database that can compare embeddings. Embeddings from different models cannot be compared, so a new embedding model means indexing everything again.
2. **Match.** The search turns the question into an embedding and compares it with those of the chunks. **Hybrid search** adds a keyword search for exact terms, such as contract numbers or product codes, and combines both results. Matching can be limited to chunks with the right metadata, but permissions take more: the search has to know who asks and which groups they belong to.
3. **Rank.** A close chunk can be on the topic without answering the question. A **reranker**, another specialized model, reads the question together with each chunk and orders the chunks by **relevance**, how well they answer it. This improves quality but is slow, so it runs only on the chunks that matching returned. Chunks that are not relevant enough are left out, even if none remain, so the model can say that it has no answer.

**Provenance** is the record of where each chunk came from, such as its source and date. It ties the copy to its sources, which neither protect it with their permissions nor update it on their own. Through it, each chunk keeps the permissions of its document for search to apply, and where they cannot be kept, only what everyone who can search may see should be copied. Each chunk also keeps its **ownership**, who is responsible for the content, so answers can be checked and errors fixed in the source. Regular runs keep the content and permissions current and apply deletions and retention rules, and monitoring catches failed runs, which are easy to miss because search keeps working on the old copy. The copy follows its sources' rules on where data may be processed and kept, and so do the embedding model and the vector store that receive it.

A reference product is [Qdrant](https://qdrant.tech/), which stores the index, covers matching, and works with rerankers.

## Semantic layers

A **semantic layer** stands between the model and the databases, usually a data warehouse. It offers business terms for the model to choose from and calculates numbers from their definitions. Without it, the model has to guess the meaning of tables and columns, so the same question can get different numbers.

1. **Definitions.** A **dataset** is data that the layer covers, such as orders or customers, and **relations** connect datasets, such as each order to its customer. A **metric** is a number calculated from them, such as net revenue, and a **dimension** is a property to split or narrow it by, such as region or month. Descriptions and synonyms tell the model that "sales" means net revenue. Each definition needs ownership.
2. **Queries.** A query asks for metrics and dimensions, such as net revenue by month in one region. The layer calculates it from the definitions, so the same query is always calculated the same way. The layer answers only what is defined, so its coverage grows with the definitions. The model can still pick the wrong metric, such as gross revenue instead of net, so answers should name the metrics behind them.
3. **Permissions.** The layer filters data itself, by rules that depend on who asks. Rules on rows decide which records count, so a regional manager gets the numbers of one region, and rules on columns hide fields such as salaries. The rules are kept in the layer or in the data platform that stores the data, and they apply to every query, so the model cannot skip them. With one shared account, though, everyone gets what that account can see.

Approaches to semantic layers differ in who builds the query. With **named metrics**, the model picks metrics and dimensions by name, and the layer builds the query, which gives the most control but needs every metric defined first. With a **query language**, the model builds the query over the definitions, which is more flexible but easier to get wrong. With **question and answer**, the layer's own agent takes the question and builds the query, which is the simplest to use but hides how it chose the metrics.

A reference product is [WrenAI](https://www.getwren.ai/), which gives agents definitions and queries over MCP, while permissions take its paid edition.

## Knowledge graphs

A **knowledge graph** stores facts as things and the links between them, so one answer can draw on several systems. It pays off for questions that take several links, which separate searches can miss.

1. **Ontology.** An ontology lists the kinds of things, such as customers and orders, the links allowed between them, and the rules they follow. This gives them one meaning across systems: customers in sales and accounts in billing become one kind of thing. It can start small, with the things that the most valuable questions need. Departments have to share one ontology, and it changes as the business does, so it needs ownership.
2. **Facts.** An ETL pipeline usually fills the graph with facts, such as one customer placing one order. Records are mapped to the ontology through their identifiers. Documents need a model to extract facts, which can produce wrong ones. **Entity resolution** matches the same thing, or entity, across sources, such as one company listed under two names: a missed match hides links, and a wrong one connects things that have nothing in common.
3. **Queries.** A query follows links from one thing to the next, which is called **traversal**, such as from a supplier to its products and their orders. The links followed can be shown with the answer, so people can check it. Permissions on things and links decide what each person or agent can follow, but a graph that copies its sources does not inherit their permissions. Results grow with every link, so queries need a limit on how far they go.

Approaches to knowledge graphs differ in how the facts get in. With **GraphRAG**, a model extracts them from documents, and the search follows links from the matching chunks, which takes less work from people but leaves the facts unchecked. With a **graph database**, a pipeline loads them, and the model explores them by writing its own queries, which is more flexible but leaves the ontology and the facts to the team.

A reference product is [Neo4j](https://neo4j.com/), which covers facts and queries, while permissions take its paid edition.
