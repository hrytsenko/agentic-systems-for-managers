---
title: Platforms
description: How platforms turn agent requests into model responses.
slug: ai-literacy/platforms
sidebar:
  label: Platforms
  order: 2
---

The agent reaches the model through a **platform**. A platform combines three parts: the **model gateway** that accepts agent requests, the **inference engine** that runs the model, and the **model** itself that produces the response. A **public** platform, such as a model vendor's, runs all three as a service. A **sovereign** platform runs them on infrastructure the organization controls.

1. **Model gateway.** It provides the **API** that agents send requests to. It verifies callers, authorizes requests, applies rate limits, meters usage, and moderates content. On a public platform, the organization configures it for its teams with API keys and budgets.
2. **Inference engine.** It **encodes** the request into **tokens**, short pieces of text, and **decodes** the generated tokens back into text. It **schedules** many requests on shared **GPUs**, processors built to do many calculations at once, and **caches** the model's work, so repeated input is not processed again.
3. **Model.** It reads input tokens and writes output tokens. Models differ in capability, speed, price per token, and **context size**, how many tokens they accept in one request, so simpler work can go to a smaller, cheaper model.

A **harness** is everything around the model that steers its work. After the project harness the team writes and the agent harness the agent brings, the platform adds a third level: the **platform harness** is the set of features it offers with the model. **Moderation**, run by the gateway, screens requests and responses against a policy; **structured outputs** make responses follow a required format; and **built-in tools**, such as web search or MCP connectors to external systems, run on the platform instead of going through the agent. Teams do not change the platform harness; they choose which of its features to use.

The choice between a public and a sovereign platform starts with the data in requests. On a public platform, the vendor's **data terms** decide what happens to it: whether it is used for training, how long it is kept, and in which region it is processed. Enterprise agreements usually exclude training and limit retention, and a regional deployment can meet **data residency**, the need to keep data in a given country. A sovereign platform is needed only where these fall short.

:::tip[Takeaways]

- **Data terms come first.** Training use, retention, and region decide whether a public platform is enough.
- **Rate limits slow, budgets stop.** Agents wait out a rate limit, but a spent budget leaves tasks unfinished, so plan both ahead.
- **GPU memory sizes a sovereign platform.** Model size, context size, and requests at once decide how many GPUs are needed.

:::

## Model gateways

A **model gateway** is the front door of a platform: every request passes through it on the way in and every response on the way out, so it is where access, usage, and moderation are controlled.

1. **Access.** The gateway issues **API keys** that identify the caller, such as a team, project, or agent, so access can be granted, limited, or revoked for one caller without affecting the others. For each caller, the gateway allows only approved models, such as models cleared for customer data. Access to models becomes a decision the organization manages in one place, not a key copied from person to person.
2. **Usage.** The gateway caps and counts what each caller uses. **Rate limits** cap tokens or requests per minute, so that no caller takes all the capacity. An agent that hits a rate limit waits and retries, so agents that share a limit slow each other down. **Budgets** cap spending per period: when spending reaches the cap, the gateway refuses requests until the period ends or someone raises it. **Metering** counts input and output tokens per caller and model, so cost and load are visible.
3. **Moderation.** The gateway screens requests and responses against a policy, such as rules on harmful content, personal data, or secrets, and blocks or masks what breaks it. Whether the vendor provides it on a public platform or the organization adds it on a sovereign one, moderation usually relies on a small specialized model. So it has a cost: every screened request takes extra inference and time, and false alarms block legitimate work, such as security code that looks like an attack.

All three leave logs for audits and investigations. **Access logs** show who called which model and what was refused, **usage logs** show tokens and cost over time, and **moderation logs** show what was blocked or masked and why. They can tell callers apart only when each has its own key. Access and usage logs only describe requests, but moderation logs, and full request logs where the gateway keeps them, can hold code or customer data, so they need the same retention rules as that data. On a public platform, the vendor decides which logs the organization can see and for how long.

## Inference engines

An **inference engine** is the software that runs a model on hardware. The work the engine does to turn one request into one response is called **inference**, and it is what public platforms charge for and sovereign platforms need capacity for. Its cost comes from input and output tokens, and the KV cache reduces it in exchange for GPU memory.

1. **Input tokens.** The engine splits the request text into tokens, often a short word or part of a longer one. Each model has its own vocabulary of tokens, so the same text can count differently on different models. Then, in **prefill**, the model processes all input tokens at once. The result for each token depends on that token and on every token before it, in order. Prefill is real model work, and its cost grows with the input.
2. **Output tokens.** Prefill ends with the model predicting the first output token. From there, the model produces the response one token at a time: each pass takes the newest token, looks back at everything before it, and predicts the next one. It stops when it predicts a stop token or reaches the output limit. Some models **reason** first: they write their thinking as output tokens before the response, so harder problems get better results but take longer and cost more.
3. **KV cache.** The key-value cache fills during prefill, one entry per input token, and grows by one entry with each output token. It is how each pass looks back without recomputing, so earlier work is not repeated within the request. With **prompt caching**, the KV cache built in prefill outlives the request: the engine keeps it, typically for minutes. A later request can reuse it for its **prefix**, the opening part that matches the earlier request up to the first difference, so prefill runs only on the rest. Cached input tokens cost less, and the response starts sooner.

## Sovereign models

A **sovereign model** is a model that runs on a sovereign platform, so requests and responses stay on infrastructure the organization controls. Running one takes open weights and GPUs, and quantization cuts how many GPUs are needed.

1. **Open weights.** A model is a large set of numbers, called **weights**, learned in training. Weights are also called **parameters**, and a model's size is given as their count, such as 70B for 70 billion. An **open-weight** model has its weights published, so anyone can download it and run it on hardware they control, while a **closed** model is usually available only on a public platform.
2. **GPUs.** Running a model means multiplying huge tables of weights for every token, so the inference engine runs on GPUs. The weights must fit in GPU memory, together with the KV cache of every request in progress. At 16 bits per weight, a 70B model takes about 140 GB of memory before any KV cache. Long contexts and many requests at once need still more memory, because the KV cache grows with every token. When a model does not fit in one GPU, the engine splits it across several.
3. **Quantization.** It stores each weight with fewer bits, such as 8 or 4 instead of 16, so the model takes half or a quarter of the memory and fits on fewer GPUs. The cost is precision: responses get somewhat worse, more so with fewer bits, and how much varies by model and task. Many open-weight models are also published in quantized versions.

Sovereign models come with trade-offs. Open weights are not open source: the training data and code usually stay private, and a license sets the terms of use, such as limits on commercial use. Open-weight models often trail the leading closed models, and smaller ones that need less hardware trail further, so a sovereign platform can limit what agents can take on. GPUs are expensive and cost the same whether busy or idle, so the organization pays for capacity, not for use. They also need **provisioning**: tools such as Kubernetes assign GPUs to engines and scale engines as load changes, and running these tools requires expertise.
