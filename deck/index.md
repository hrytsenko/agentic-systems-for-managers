---
marp: true
theme: guide
lang: en
title: Enterprise Agentic Systems
description: A lean guide for managers and staff engineers to the concepts, costs, and risks of agentic systems for business.
paginate: true
---

# Enterprise Agentic Systems

Agentic systems need agents to solve tasks, models to make decisions, and data to ground them. A large organization sets up what it takes to run each part once, for many teams.

- **Governed agents** let the organization know and control what its agents use and how they reach models and other systems.
- **Sovereign models** keep the data in requests and responses on a platform that the organization controls.
- **Semantic data** lets agents find the organization's data by its meaning.

Whether the organization runs models and data itself depends on data terms, but it governs its agents either way, because the terms do not limit what agents do.

---

# Data terms

When a vendor runs a part, its **data terms** decide what happens to the data: whether it is used for training, how long it is kept, and in which region it is processed. The terms fall short, and the organization has to own the part, when:

- **A legal obligation**, such as regulation or a customer contract, forbids sending the data to a vendor, or to one whose home laws can force it to hand over data stored in another country.
- **A closed network** keeps sensitive systems off the internet, so their data cannot reach a vendor at all.

Where the terms are enough, the vendor's solution is simpler and usually the better choice, so the organization owns a part only for the work that needs it.

---

# Governed agents

Adopting agents means controlling the assets that they use, such as skills and MCP servers, and their routes to models and other systems. Still, governance is only as useful as it is complete: any route around it opens the way to **shadow AI**.

- **Curated registry** holds approved agents and what they may use.
- **AI gateway** controls requests to models.
- **MCP gateway** controls actions on other systems.

> - **Curate assets.** People rarely see what an agent uses during a task, so only reviewed instructions and tools should reach it.
> - **Control access.** Close every route around the gateways, because limits hold only where agents cannot avoid them.

---

<!-- _header: Governed agents -->
<!-- _footer: "Reference: [agentregistry](https://aregistry.ai/), with plugins and approval in the paid edition." -->

# Curated registry

Agents and what they use, kept as assets with owners and versions, so teams share them instead of copying them.

- **Assets.** Describe agents by definitions that reference skills, MCP servers, and plugins.
- **Catalogs.** List assets with owners and versions, grant them by entitlement, and keep assistants to the catalog with managed settings.
- **Approval.** Try each version on real tasks, check where it comes from and what it carries, and pin it until the next one is approved.

A **shared repository** is often enough for a few teams, and an **agent registry** covers all kinds of agents, but neither enforces the catalog by itself.

---

<!-- _header: Governed agents -->
<!-- _footer: "Reference: [LiteLLM](https://www.litellm.ai/), with SSO and most moderation services in the paid edition." -->

# AI gateway

The one way from the organization's agents to all models, including its own. It controls requests on their way out.

- **Access.** Identify callers by the identity system or virtual keys, allow approved models, and apply rate limits.
- **Routing.** Resolve each model name to a model and platform, route requests by rules, and hold each fallback to the same data rules.
- **Metering.** Count tokens per caller and model, price them at platform rates, and apply budgets.

**Screening** blocks or masks what breaks a policy in requests and responses, and the logs need masking too.

---

<!-- _header: Governed agents -->
<!-- _footer: "Reference: [agentgateway](https://agentgateway.dev/), with separate services to detect prompt injection and keep credentials." -->

# MCP gateway

The one way from the organization's agents to all MCP servers. It controls the tools they reach and the access behind them.

- **Servers.** Put approved servers behind one address, show each agent only approved tools, and refuse other tool calls.
- **Identities.** Identify unattended agents by service accounts, and let assistants act on behalf of users.
- **Credentials.** Hold credentials in a vault, add them to calls on the way out, and make them narrow and short-lived.

**Guardrails** screen tool calls for confidential data and tool results for prompt injection, and block or mask what they find.

---

# Sovereign models

Sovereign models run on a platform that the organization controls, so the data in requests and responses stays there. Still, sovereignty is about who controls the platform, not who trained the model.

- **Inference gateway** lets requests in and spreads them across engines.
- **Inference engine** runs the model on GPUs and turns each request into a response.
- **Open-weight model** has published weights, so the organization can run it.

> - **Plan GPUs.** They cost the same busy or idle, so size them for the models, the requests, and their volume before committing.
> - **Test models.** Open-weight models often trail the leading ones, so try them on real tasks before relying on them.

---

<!-- _header: Sovereign models -->
<!-- _footer: "Reference: [llm-d](https://llm-d.ai/), which runs on Kubernetes." -->

# Inference gateway

The front door to the models that the organization runs. It controls requests on their way in.

- **Admission.** Let requests in, queue or refuse them, and order them by priorities and fairness.
- **Balancing.** Pick a replica for each request by its queue, free memory, and cache.
- **Rollouts.** Resolve each model name to a version, and give a new one a canary share that grows while results hold up.

**Monitoring** tracks waits, load, and use per caller to plan capacity and split its cost, and logs of full requests follow the rules of their data.

---

<!-- _header: Sovereign models -->
<!-- _footer: "Reference: [vLLM](https://vllm.ai/), a widely used engine that llm-d works with." -->

# Inference engine

The software that runs a model on GPUs. Turning a request into a response is called inference.

- **Input tokens.** Split the request into tokens, which differ by model, and process them all at once in prefill.
- **Output tokens.** Produce the response one token at a time, with reasoning models writing their thinking first.
- **KV cache.** Keep each token's work for later passes, and with prompt caching, reuse a matching prefix in later requests.

**Scheduling** decides how many requests run together: more use the GPUs better but slow each response, and KV cache memory limits how many fit.

---

<!-- _header: Sovereign models -->
<!-- _footer: "Reference: [Qwen](https://huggingface.co/Qwen), a model family with open-weight models of many sizes." -->

# Open-weight model

A model published with its weights, the numbers learned in training, so the organization can download and run it.

- **Weights.** Choose by size in parameters, context window, and license, and send simpler work to smaller models.
- **GPUs.** Fit the weights and KV caches in GPU memory, where a 27B model at 16 bits alone takes about 55 GB, and split larger models across GPUs.
- **Quantization.** Store weights with fewer bits, such as 8 instead of 16, to halve memory for somewhat worse responses.

**Provisioning** assigns GPUs to engines and scales them with load, whether the GPUs are rented under a cloud provider's terms or owned on premises.

---

# Semantic data

Semantic data is data that agents can find by its meaning, rather than by exact words or database fields. Still, a model knows only what it learned in training, so the data has to reach it with each task.

- **Data pipeline** prepares a copy of the data for retrieval.
- **Semantic search** matches documents to a question.
- **Semantic layer** applies business definitions to records.
- **Knowledge graph** links business entities by one ontology.

> - **Set ownership.** Only the organization can decide which content is correct and what it means, so each source needs an owner.
> - **Propagate permissions.** A copy without the permissions of its source can show anyone what only some may see.

---

<!-- _header: Semantic data -->
<!-- _footer: "Reference: [Docling](https://docling.ai/), which turns documents into text and chunks for an existing pipeline." -->

# Data pipeline

An ETL that copies documents from source systems and prepares them for retrieval.

- **Extract.** Read documents with their metadata, such as owner, date, and permissions, so search can filter by it.
- **Transform.** Turn documents into text, split it into chunks, and turn each chunk into an embedding with an embedding model.
- **Load.** Write chunks, embeddings, and metadata to a vector store, and load everything again when the embedding model changes.

**Provenance** ties each chunk to its source, so search applies its permissions, regular runs keep it current, and the copy follows the source's rules on where data is kept.

---

<!-- _header: Semantic data -->
<!-- _footer: "Reference: [Qdrant](https://qdrant.tech/), which works with rerankers and leaves permissions to the application." -->

# Semantic search

A search for the document chunks closest in meaning to a question.

- **Match.** Compare the question's embedding with those of the chunks, and add a keyword search for exact terms in hybrid search.
- **Filter.** Match only chunks with the right metadata, including the permissions of whoever asks.
- **Rank.** Order the chunks by relevance with a reranker, and leave out those not relevant enough.

**Collections** split chunks by area into search tools with their own owners, so the model picks the one that fits and matching compares fewer, closer chunks.

---

<!-- _header: Semantic data -->
<!-- _footer: "Reference: [WrenAI](https://www.getwren.ai/), which offers definitions and queries over MCP, with permissions in the paid edition." -->

# Semantic layer

A layer that explains datasets to models and calculates metrics from their definitions.

- **Definitions.** Define datasets, relations, metrics, and dimensions, with descriptions and synonyms.
- **Queries.** Ask for metrics by dimensions, calculate them the same way every time, and name the metrics behind each answer.
- **Permissions.** Filter rows and columns by who asks, in every query, so the model cannot skip the rules.

Approaches differ in how queries are built: by **named metrics** for control, in a **query language** for flexibility, or by **question and answer** for simplicity.

---

<!-- _header: Semantic data -->
<!-- _footer: "Reference: [Neo4j](https://neo4j.com/), which covers facts and queries, with permissions in the paid edition." -->

# Knowledge graph

A graph that links things under a common ontology, so one answer can span several systems.

- **Ontology.** List the kinds of things, their links, and rules, so customers in sales and accounts in billing become one kind.
- **Facts.** Map records to the ontology by their identifiers, and match each entity across sources by entity resolution.
- **Queries.** Follow links by traversal, within permissions and a limit on depth, and show the links with the answer.

Approaches differ in how facts get in: with **GraphRAG**, a model extracts them from documents, and with a **graph database**, a pipeline loads them from records.
