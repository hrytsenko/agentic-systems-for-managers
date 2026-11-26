---
title: Sovereign models
description: What sovereign models are and what it takes to run them.
---

An agent reaches a model through a **platform**, which accepts its requests, runs the model, and returns the responses. A **sovereign model** runs on a platform that the organization controls, so the data in requests and responses stays there. Sovereignty is about who controls the platform, not who trained the model. Running sovereign models takes three parts: an **inference gateway** that lets requests in and spreads the load, an **inference engine** that runs the model on **GPUs**, the processors that models need, and an **open-weight model**, published for anyone to download, that produces the responses.

Requests usually come through an **AI gateway**, one entry to all models, which handles what is the same for each of them: who may use a model, how much, and what requests and responses may contain. Sovereign models leave this to it, including moderation, because an open-weight model comes without screening for harmful content. The rest of the path is about using the GPUs well: the inference gateway decides when and where a request runs, and the engine turns it into a response.

:::tip[Takeaways]

- **Plan GPUs.** They cost the same busy or idle, so size them for the models, the requests, and their volume before committing.
- **Test models.** Open-weight models often trail the leading ones, so try them on real tasks before relying on them.

:::

## Inference gateways

An **inference gateway** is the front door to the models that the organization runs. It is an ingress gateway: it controls requests on their way in. GPUs can take only so many requests at once, so the gateway decides which ones to let in, where each one runs, and which version of a model serves it.

1. **Admission.** The gateway lets requests in, makes them wait in a queue, or refuses them. **Priorities** decide who goes first when the GPUs are full, such as a person waiting for an answer before a batch of documents. **Fairness** gives callers of the same priority equal turns, so that no team takes all the capacity. Both depend on who the caller is, which has to come from the AI gateway, not from the caller.
2. **Balancing.** Busy models run as several copies of the engine, called **replicas**, and the gateway picks one for each request. Requests differ so much in size that equal shares work poorly, so the gateway looks at the queue and the free memory of each replica. With **cache-aware** balancing, it also prefers a replica that has already processed the opening part of the request, which saves GPU time and starts the response sooner.
3. **Rollouts.** Agents ask for a model by a name, and the gateway decides which version serves it, so a version can change without changing the agents. A new version first gets a small share of requests, called a **canary**, and the share grows while results hold up or drops back to zero when they do not.

The gateway measures how long requests wait, how busy the replicas are, and how much each caller uses, so capacity can be planned and its cost split between teams. Logs of full requests can hold personal or confidential data, so they need the same residency and retention rules as that data.

A reference tool is [llm-d](https://llm-d.ai/), which covers admission, balancing, and rollouts on Kubernetes.

## Inference engines

An **inference engine** is the software that runs a model on GPUs. The work it does to turn one request into one response is called **inference**.

1. **Input tokens.** The engine splits the request text into **tokens**, often a short word or part of a longer one. Each model has its own vocabulary of tokens, so the same text can count differently on different models. Then, in **prefill**, the model processes all input tokens at once. The result for each token depends on that token and on every token before it, in order.
2. **Output tokens.** Prefill ends with the model predicting the first output token. From there, the model produces the response one token at a time: each pass takes the newest token, looks back at everything before it, and predicts the next one. It stops when it predicts a stop token or reaches the output limit, and the engine turns the tokens back into text. Some models **reason** first: they write their thinking as output tokens before the response, so harder problems get better results.
3. **KV cache.** The key-value cache fills during prefill, one entry per input token, and grows by one entry with each output token. It is how each pass looks back without recomputing, so earlier work is not repeated within the request. With **prompt caching**, the KV cache built in prefill outlives the request: the engine keeps it, typically for minutes. A later request can reuse it for its **prefix**, the opening part that matches the earlier request up to the first difference, so prefill runs only on the rest and the response starts sooner.

**Scheduling** decides how many requests the engine runs together and how many wait in a queue. Running more together uses the GPUs better, but each response takes longer, and the memory for their KV caches limits how many fit.

A reference tool is [vLLM](https://vllm.ai/), a widely used engine that llm-d works with.

## Open-weight models

An **open-weight model** is published with its **weights**, the numbers learned in training, so the organization can download and run it. Such models often trail the leading **closed** ones, whose weights are not published.

1. **Weights.** A model is a large set of weights, also called **parameters**, and its size is given as their count, such as 27B for 27 billion. Larger models are usually more capable but need more GPUs, so simpler work can go to a smaller one. Models also differ in their **context window**, how many tokens they accept in one request. Open weights are not open source: the training data and code usually stay private, and a license sets the terms of use, such as limits on commercial use. Each model is tried on the organization's own tasks, and again when a newer one could replace it.
2. **GPUs.** Running a model means multiplying huge tables of weights for every token, which takes GPUs. The weights must fit in GPU memory, together with the KV cache of every request in progress. At 16 bits per weight, a 27B model takes about 55 GB of memory before any KV cache, and a 750B model takes about 1.5 TB. Long requests, and many of them at once, need still more memory, because the KV cache grows with every token. When a model does not fit in one GPU, the engine splits it across several.
3. **Quantization.** It stores each weight with fewer bits, such as 8 instead of 16, so the same model takes half the memory and fits on fewer GPUs. Many open-weight models are also published in quantized versions. Responses get somewhat worse, more so with fewer bits, and how much varies by model and task.

GPUs can be rented or owned. Rented ones need no large purchase and can be given up later, but the cloud provider's terms apply, while owned ones keep the data on the organization's own premises. Either way, they need **provisioning**: tools such as Kubernetes assign GPUs to engines and scale engines as load changes.

A reference model family is [Qwen](https://huggingface.co/Qwen), with open-weight models of many sizes, and a reference tool for running models on Kubernetes is [KServe](https://kserve.github.io/website/), which works with both vLLM and llm-d.
