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

# Sovereign models

Sovereign models run on a platform that the organization controls, so the data in requests and responses stays there. Still, sovereignty is about who controls the platform, not who trained the model.

- **Inference gateway** lets requests in and spreads them across engines.
- **Inference engine** runs the model on GPUs and turns each request into a response.
- **Open-weight model** has published weights, so the organization can run it.

> - **Plan GPUs.** They cost the same busy or idle, so size them for the models, the requests, and their volume before committing.
> - **Test models.** Open-weight models often trail the leading ones, so try them on real tasks before relying on them.

---

# Semantic data

Semantic data is data that agents can find by its meaning, rather than by exact words or database fields. Still, a model knows only what it learned in training, so the data has to reach it with each task.

- **Data pipeline** prepares a copy of the data for retrieval.
- **Semantic search** matches documents to a question.
- **Semantic layer** applies business definitions to records.
- **Knowledge graph** links business entities by one ontology.

> - **Set ownership.** Only the organization can decide which content is correct and what it means, so each source needs an owner.
> - **Propagate permissions.** A copy without the permissions of its source can show anyone what only some may see.
