---
title: Agents
description: How agents turn model decisions into completed tasks.
slug: ai-literacy/agents
sidebar:
  label: Agents
  order: 1
---

An **agent** is software that lets a model solve tasks: the model makes the decisions, and the agent carries them out. A task can be **interactive**, where a person starts it, follows the progress, and approves actions. Or it can be **unattended**, where an event, such as a new pull request, starts it, and the agent runs alone until it finishes. Either way, the agent works with the **context** that holds everything it sends to the model, the **session** that carries the task from start to finish, and the **capabilities** that give the model more ways to solve it.

1. **Context.** It starts with the task, the agent's built-in instructions, and the project instructions. As the work goes on, it grows with the model's responses, the project knowledge that the task needs, and tool outputs.
2. **Session.** It runs as a **conversation** between the agent and the model, made of **steps**. In each step, the agent sends the current context to the model and handles the response. The response is either a final answer or a request for an **action**: loading a skill, using a tool, or handing part of the task to a subagent. Steps repeat until the model gives a final answer or a limit stops them.
3. **Capabilities.** The agent describes its capabilities to the model, and the model decides when to use them. When used, each adds to the context: a **skill** adds instructions for a kind of task, a **tool** adds the result of an action, such as running tests, and a **subagent** adds the answer to part of the task.

Everything around the model that steers its work is called a **harness**, and two levels of it come together in the agent. The **project harness** is the content a team keeps in its project for agents: project instructions, capabilities, and checks, such as tests, that tell the agent what to fix. The **agent harness** is the agent's own machinery: its built-in instructions, tools, and permissions, and the way it runs sessions and manages the context. Teams write the project harness but only configure the agent harness.

:::tip[Remember]

- **Agents get only the access they need.** The model decides, and its actions run on real systems.
- **Project instructions stay short.** Point them to knowledge, because long ones cost more and steer less.
- **Capabilities belong in the project.** Shared and reviewed, they make the agent work the same for everyone.
- **Unattended sessions need limits.** Cap steps and budget, because no one is there to stop them.

:::

## Context

The context combines instructions and knowledge from three sources to help the model make better decisions.

1. **Built-in instructions.** They are the agent's own instructions, written by its vendor and also called **system instructions** or the **system prompt**. They come first in the context, are present at every step, and take priority when instructions conflict. They set how the agent works, such as how it uses its tools and which safety rules it follows. Teams usually keep them as they are and add to them only when necessary.
2. **Project instructions.** They are files the team keeps in the project, usually named `AGENTS.md`. The agent loads them at the start of every session. They hold what most tasks need: key decisions and common workflows. They tend to grow over time, which raises the cost of every step and leads to **context rot**: the longer the context, the less reliably the model follows it. So they need continuous curation and cleanup.
3. **Project knowledge.** It is the documents the agent can read during a task, such as specifications or wikis. Some live in the project, and others in systems the agent reaches through tools. Knowledge is much larger than project instructions, so the agent reads only what the task needs. The agent can only look for what it knows exists, so project instructions say where knowledge lives and when to use it.

Knowledge stays usable through **progressive disclosure**: the agent reads a short overview first and loads details only when the task needs them. For knowledge, the overview is an **index**, a document that lists the others with a line on what each covers. Project instructions point to the index instead of copying the knowledge, and the agent reads the index and then only the documents it picks. Short documents with clear titles work best, because they let the agent pick precisely and read less.

## Session

A session holds all the steps that the agent and the model take to solve the task. The longer it runs, the more each step costs and the more **context rot** affects the work. Handoffs and limits keep both in check.

1. **Conversation.** It starts with the task and grows with every step: the model's decisions on which actions to take, and the results of those actions. Each step sends all of it again, which is why costs grow. A final answer ends the steps, but in an interactive session the person can reply and continue. When the conversation nears the size limit of the context, the agent **compacts** it: it replaces older steps with a summary or clears old results of actions. The session can go on, but early decisions and constraints can be lost.
2. **Handoffs.** A handoff ends a long session on purpose and continues the work in a new one. Instead of letting compaction decide what to keep, the agent writes a note on the state of the work: what is done, what is left, and which decisions were made. The next session starts with a fresh context and reads the note first, so it begins with what matters and nothing else. The note can be a file in the project or an update on a ticket.
3. **Limits.** They are caps that stop a session from outside: a maximum number of steps, a time limit, or a budget. A stalled task does not always stop on its own: the model can keep trying endlessly. A person can stop an interactive session, but an unattended one has only the caps set in advance. The team caps a single session, while the organization sets budgets per team or project, across many sessions. When a session hits a cap, it stops wherever it is, so the work survives only if its state was written down along the way.

Every session leaves a **transcript**, a log of all its steps, including the compactions. It shows what the agent did and why, so the team can evaluate the agent's behavior and correct it. Corrections go into the project harness, such as a clearer instruction or a new check, so that later sessions do not repeat the mistake. For an unattended session, the transcript is often the only record of how the work was done, so it needs to be kept.

## Capabilities

Capabilities give the model more ways to solve the task. Each one is listed in the context with a short description that tells the model when to choose it. Kept in the project, they are the same for every person and agent, and the team can review them like code.

1. **Skills.** A skill explains how to carry out a process, such as reviewing a pull request, through curated instructions. It can also include supporting files, such as documents and scripts. Both load through **progressive disclosure**, so an unused skill takes little space. A skill does nothing by itself: it tells the model how to do the work, and the work runs through the agent's tools. Its instructions describe the process rather than one project, so the same skill can serve many projects.
2. **Tools.** A tool performs an action on a real system, such as creating a ticket. Agents have tools of their own, such as reading files and running commands. Other systems offer theirs through the **Model Context Protocol (MCP)**, an open standard, from **MCP servers** that their vendors often host. A project lists the servers it uses in a configuration file, often named `mcp.json`, so everyone in the project gets the same tools, while credentials stay outside the file.
3. **Subagents.** A subagent is a separate agent with its own curated instructions, such as one that explores the codebase. It can also have its own skills, tools, and model, but it works within the main agent's access. The model writes a task for it, and the subagent works on that task in a conversation of its own, so the main context stays focused and receives only the final answer. A subagent can also act as a proxy for a remote agent, run by another team or vendor and reached through the **Agent2Agent (A2A)** protocol, an open standard for agents to work together.

Tools and subagents work with the agent's **access**, and whose access that is depends on how the agent runs. In an interactive session, the agent acts as the person, and its permissions decide which actions wait for approval. In an unattended session, no one is there to approve, so the agent uses a **service account**, an identity of its own, with permissions set in advance. Each system's owner grants that access, so setting it up often needs their approval. Remote systems usually grant it through **OAuth**, a standard for access that can be limited and revoked.
