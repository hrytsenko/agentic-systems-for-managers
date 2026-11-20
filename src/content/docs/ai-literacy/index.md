---
title: AI Literacy
description: A shared language for conversations about models and agents that bridge business and engineering.
sidebar:
  label: Overview
  order: 0
---

## Purpose

A shared language for conversations about models and agents that bridge business and engineering.

## Team level

Discuss how agents work and how to extend them.

### How agents work

The parts of an agent and how they fit together.

| Part         | Role                                       |
| ------------ | ------------------------------------------ |
| **Model**    | Predicts text from what is in its context. |
| **Platform** | Serves models through an API.              |
| **Agent**    | Gives the model memory and tools.          |
| **Context**  | Agent instructions and knowledge.          |

### How agents gain capabilities

The parts that extend an agent with knowledge or reach.

| Extension           | Adds                                      |
| ------------------- | ----------------------------------------- |
| **Skills**          | Packaged knowledge for specialized tasks. |
| **Tools (MCP)**     | Connections to external systems.          |
| **Retrieval (RAG)** | Search over organization knowledge.       |
| **Agents (A2A)**    | Collaboration with other agents.          |

## Organization level

Discuss the shared infrastructure that keeps agents governed, safe, and affordable at scale.

### How organizations run agents

Controls that let teams run agents safely.

| Control        | Purpose                                                          |
| -------------- | ---------------------------------------------------------------- |
| **Gateways**   | One entry point to models for interactive and autonomous agents. |
| **Registries** | Curated catalogs of approved skills and tools.                   |
| **Sandboxes**  | Isolated environments for autonomous runs.                       |

### How organizations build business agents

Controls for agents that work with business data.

| Control              | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| **Vector stores**    | Governed knowledge for retrieval.                              |
| **Semantic caches**  | Reused answers to similar questions, cutting cost and latency. |
| **Sovereign models** | Open-weight models for data residency or regulated work.       |
