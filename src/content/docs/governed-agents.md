---
title: Governed agents
description: What governed agents are and what it takes to run them.
---

An **agent** is software that lets a model solve tasks: the model makes the decisions, and the agent carries them out with **tools**, actions on other systems. For each decision, the agent sends the model the **context**, everything it has for the task so far, and the model responds with an action to take or the final answer.

**Governed agents** use only what the organization has approved and reach models and other systems only by routes that it controls, so they replace **shadow AI**, the use of AI that the organization has not approved and cannot see. They rely on three capabilities: a **curated registry** that holds approved agents and what they may use, an **AI gateway** that controls requests to models, and an **MCP gateway** that controls actions on other systems.

:::tip[Takeaways]

- **Curate assets.** People rarely see what an agent uses during a task, so only reviewed instructions and tools should reach it.
- **Control access.** Close every route around the gateways, because limits hold only where agents cannot avoid them.

:::

## Curated registries

A **curated registry** keeps agents and what they use as assets that have owners and versions, so teams share them instead of copying them between projects. People rarely see what an agent uses during a task, so the check has to come before it.

1. **Assets.** As an asset, an agent is a **definition**: instructions for its work, the recommended model, and references to the capabilities it needs. A **skill** adds instructions for a process, with documents and scripts where needed. An **MCP server** adds tools to reach other systems. A **plugin** bundles skills and MCP servers that work together into one asset. References replace copies, so one capability serves many agents, and they show what each agent can do.
2. **Catalogs.** A **catalog** lists each asset with its owner, version, and the access it needs, and agents get their assets from it. An assistant that people use gets them when it is installed or starts, and **managed settings**, which the organization sets and users cannot change, keep it to the catalog. An agent inside a business process gets them when it is deployed, so what runs is what was tested. Some agents also search the catalog during a task, which finds more but can combine assets that were never tried together. An **entitlement** decides who may use an asset, usually by the groups that people belong to in the organization's identity system, so a payroll agent is offered only to the payroll team.
3. **Approval.** New wording, another capability, or another model can change how an agent behaves, so each version is tried on real tasks before it is used. The check also covers where the asset comes from and what instructions, descriptions, and scripts it carries. Approval covers one version, which is **pinned**, fixed until the next one is approved. An approved asset can be withdrawn, and the references show which agents lose it.

Registries differ in where the catalog is kept and who enforces it. With a **shared repository**, pull requests serve as review and approval, which is often enough for a few teams but enforces nothing by itself. With an **agent registry**, one catalog with an approval workflow covers all kinds of agents, but enforcement is left to the settings of each.

A reference product is [agentregistry](https://aregistry.ai/), which covers assets and catalogs, while plugins and approval take its paid edition.

## AI gateways

An **AI gateway** is the one way from the organization's agents to models, including those that the organization runs. It is an egress gateway: it controls requests on their way out, so it decides who may use which model, where each request goes, and how much each caller may use.

1. **Access.** The gateway identifies each caller, such as a person, a team, or an agent, through the organization's identity system or by a **virtual key**, a key that works only on the gateway. The keys to the model platforms stay inside the gateway, so access can be granted, limited, or revoked for one caller without affecting the others. For each caller, the gateway allows only approved models and sets **rate limits**, caps on requests or tokens per minute.
2. **Routing.** Agents ask for a model by a name, and the gateway decides which model on which platform serves it, so either can change without changing the agents. Rules send certain requests to certain models, such as those with sensitive data to a model that the organization runs. That keeps the data inside the organization only if the organization runs the gateway too. A **fallback** sends the request elsewhere when the first choice fails or reaches its limits. An outage can quietly move data where it must not go, so each fallback has to meet the same rules for data as the first choice.
3. **Metering.** The gateway counts input and output tokens per caller and model and prices them at each platform's rates, so costs can be compared across models and split between teams. **Budgets**, caps on tokens or spending per period, use these counts to stop a caller once it reaches its limit.

**Screening** controls what requests and responses carry: the gateway checks them against a policy, such as rules on personal data, credentials, or harmful content, and blocks or masks what breaks it. The check is done by fixed rules, a small specialized model, or the organization's existing **data loss prevention (DLP)**, a service that looks for sensitive data. The gateway's logs can hold the same data, so they need masking, access rules, and retention limits.

A reference product is [LiteLLM](https://www.litellm.ai/), which covers access, routing, metering, and screening, while SSO and most moderation services take its paid edition.

## MCP gateways

An **MCP gateway** is one entry point to all MCP servers. What an agent can do in other systems depends on the tools that it can call and the access behind them, so the gateway controls which servers and tools it reaches, whose identity it acts under, and which credentials it needs.

1. **Servers.** The gateway puts the approved MCP servers behind one address, so agents connect to the gateway instead of to each server, and a server is added or removed in one place. A server often offers more tools than a task needs, so the gateway shows each agent only the approved ones and refuses any **tool call**, the agent's use of a tool, to the rest.
2. **Identities.** An unattended agent acts under a **service account**, an identity of its own. An assistant that people use acts **on behalf of a user**, so it reaches only what that user may, and records name both. The gateway does this by **token exchange**: it swaps proof of the user's identity for short-lived access to one system. On one shared service account, every user would get what that account can see. Either way, permissions that are too broad pass to the agent.
3. **Credentials.** Agents need **credentials**, such as keys and tokens, to access other systems. Kept with the agent, they could leak through it, so a **credential vault** keeps them, and the gateway adds them to calls on the way out. Each credential is narrow and short-lived, usually through **OAuth**, a standard for access that can be limited and revoked, and the vault automatically renews it. A system that offers only permanent keys with full access needs the gateway's rules to narrow it.

**Guardrails** check what tools bring in and send out, because the same tools that do the work can let instructions in and data out. They screen tool calls for confidential data and tool results for **prompt injection**, instructions in content from outsiders, such as a customer's email, that the model may follow. Screening misses some attacks, so an agent that reads content from outsiders should get no tools that send data out.

A reference product is [agentgateway](https://agentgateway.dev/), which covers servers, identities, and guardrails, and works with separate services to detect prompt injection and keep credentials.
