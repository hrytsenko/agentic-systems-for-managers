---
title: AI Literacy
description: A shared language for conversations about models and agents that bridge business and engineering.
sidebar:
  label: Overview
  order: 0
---

## Purpose

A shared language for conversations about models and agents that bridge business and engineering.

## Agents

Discuss how agents work and how to extend them.

| Capability          | Adds                                      |
| ------------------- | ----------------------------------------- |
| **Skills**          | Packaged knowledge for specialized tasks. |
| **Tools (MCP)**     | Connections to external systems.          |
| **Subagents (A2A)** | Collaboration with other agents.          |

## Environments

Discuss where agents find capabilities, where they run, what they can reach, and what they keep between sessions.

| Component           | Purpose                                                       |
| ------------------- | ------------------------------------------------------------- |
| **Registries**      | Curated catalogs of approved skills and MCP servers.          |
| **Sandboxes**       | Isolated spaces where agents run, cut off by default.         |
| **Egress gateways** | One exit point from sandboxes to approved tools and services. |
| **Memory stores**   | State and experience that agents keep between sessions.       |

## Platforms

Discuss how platforms turn agent requests into model responses and govern access to them.

| Component             | Purpose                                                          |
| --------------------- | ---------------------------------------------------------------- |
| **Model gateways**    | One entry point to models for interactive and unattended agents. |
| **Inference engines** | Software that runs models and turns requests into responses.     |
| **Sovereign models**  | Open-weight models for when public data terms fall short.        |

## Data

Discuss how knowledge and past answers become searchable by meaning, and who governs them.

| Component           | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| **Semantic caches** | Reused answers to similar questions, cutting cost and latency. |
| **Vector stores**   | Governed knowledge for retrieval.                              |
