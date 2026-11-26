---
title: Governed agents
description: What governed agents are and what it takes to run them.
---

An **agent** is software that lets a model solve tasks: the model makes the decisions, and the agent carries them out with **tools**, actions on other systems. For each decision, the agent sends the model the **context**, everything it has for the task so far, and the model responds with an action to take or the final answer. **Governed agents** use only what the organization has approved and reach models and other systems only by routes that it controls. They rely on three parts: a **curated registry** that holds approved agents and what they may use, an **AI gateway** that controls requests to models, and an **MCP gateway** that controls actions on other systems.

An **egress proxy**, a server that blocks outgoing traffic except to approved destinations, keeps agents from going around the gateways. Together, the gateways form an **audit trail**, a record of what each agent requested, for whom, and at what cost. Agents can add **traces**, which link all requests and actions of one task, usually in **OpenTelemetry**, an open standard, so different agents share one record. The record can hold personal and confidential data, so it needs masking, access rules, and retention limits.

:::tip[Takeaways]

- **Control assets.** Agents should use only what was reviewed, because people rarely see what an agent uses during a task.
- **Control access.** Close every route around the gateways, because limits hold only where the model cannot avoid them.

:::

## Curated registries

A **curated registry** keeps agents and what they use as assets that have owners and versions, so teams share them instead of copying them between projects. People rarely see what an agent uses during a task, so the check has to come before it.

1. **Assets.** As an asset, an agent is a **definition**: instructions for its work, the recommended model, and references to the capabilities it needs. A **skill** adds instructions for a process, with documents and scripts where needed. An **MCP server** adds tools. A **plugin** bundles skills and MCP servers that work together into one asset. References replace copies, so one capability serves many agents, and they show what each agent can do. New wording, another capability, or another model can change how an agent behaves, so each version is tried on real tasks before it is used.
2. **Catalogs.** A catalog governs the assets: it lists each one with its owner, version, status, and the access it needs. **Review** checks where an asset comes from and what instructions, descriptions, and scripts it carries. **Approval** covers one version, which is **pinned**, fixed until the next one is reviewed. **Veto** rejects an asset or withdraws an approved one, and the references show which agents lose it.
3. **Entitlements.** An **entitlement** decides who may use an asset, usually by the groups that people belong to in the organization's identity system, so a payroll agent is offered only to the payroll team. **Managed settings**, which the organization sets and users cannot change, keep agents to the catalog wherever they run. Agents that run outside it are called **shadow AI**, and blocked traffic to models is often the first sign of them.

Registries differ in where the catalog is kept and who enforces it. With a **shared repository**, pull requests serve as review and approval, which is often enough for a few teams but enforces nothing by itself. With an **agent registry**, one catalog with an approval workflow covers all kinds of agents, but enforcement is left to the settings of each.

A reference tool is [agentregistry](https://aregistry.ai/), which covers assets and their approval.

## AI gateways

An **AI gateway** is the one way from the organization's agents to models, including those that the organization runs. It is an egress gateway: it controls requests on their way out, so it decides who may use which model, where each request goes, and what it may carry.

1. **Access.** The gateway identifies each caller, such as a person, a team, or an agent, through the organization's identity system or by a **virtual key**, a key that works only on the gateway. The keys to the model platforms stay inside the gateway, so access can be granted, limited, or revoked for one caller without affecting the others. For each caller, the gateway allows only approved models and sets **rate limits**, caps on requests or tokens per minute, and **budgets**, caps on tokens or spending per period.
2. **Routing.** Agents ask for a model by a name, and the gateway decides which model on which platform serves it, so either can change without changing the agents. Rules send certain requests to certain models, such as those with sensitive data to a model that the organization runs. A **fallback** sends the request elsewhere when the first choice fails or reaches its limits. An outage can quietly move data where it must not go, so each fallback has to meet the same rules for data as the first choice.
3. **Screening.** The gateway checks requests and responses against a policy, such as rules on personal data, credentials, or harmful content, and blocks or masks what breaks it. The check is done by fixed rules, a small specialized model, or the organization's existing **data loss prevention (DLP)**, a service that looks for sensitive data.

The gateway counts input and output tokens per caller and model, which is called **metering**, so costs can be compared across models and split between teams. When the organization runs models to keep data inside, it has to run the gateway too, or the data leaves through it.

A reference tool is [LiteLLM](https://www.litellm.ai/), which covers access, routing, and screening, while SSO takes its paid edition.

## MCP gateways

An **MCP gateway** is one entry point to all MCP servers. What an agent can do in other systems depends on the tools that it can call and the access behind them, so the gateway controls which tools it uses, whose identity it acts under, and which credentials it needs.

1. **Tools.** A server often offers more tools than a task needs, so the gateway shows each agent only the approved ones. It checks each **tool call**, the agent's use of a tool, and forwards it, refuses it, or holds it until a person approves, such as for changes that are hard to undo.
2. **Identities.** An agent can act **on behalf of a user**, so it reaches only what that user may, and records name both. The gateway does this by **token exchange**: it swaps the proof of who the user is for short-lived access to one system. When no user is there, such as when an event starts the agent, it acts under a **service account**, an identity of its own. With one service account for everyone, though, anyone who can use the agent gets what that account can see. Either way, permissions that are too broad for the person or the account are too broad for the agent.
3. **Credentials.** Agents need **credentials**, such as keys and tokens, to access outside systems. Kept with the agent, they could leak through it, so a **credential vault** keeps them, and the gateway adds them to calls on the way out. Each credential is narrow and short-lived, usually through **OAuth**, a standard for access that can be limited and revoked, and the vault renews it. A system that offers only permanent keys with full access needs the gateway's rules to narrow it.

A reference tool is [agentgateway](https://agentgateway.dev/), which covers tools and identities and works with a separate credential vault.
