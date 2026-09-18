---
title: "Conduit: a gateway so work AI stays cheap"
date: 2026-07-21
description: "The work LLM gateway. One door for model calls, budgets attached, so Cursor and the routines don't each burn their own pile of tokens."
permalink: /ai/conduit/
categories:
  - AI
tags:
  - Conduit
  - LLM
  - Costs
  - Gateway
  - AI
toc: false
---

Routines and the editor loop only work at work if someone is watching the bill. Left alone, every tool talks to a frontier model with its own key. You find out at the end of the month.

Conduit is the gateway I use so that doesn't happen. One door. Work traffic goes through it. Cheaper models where they are enough, spend you can actually see, a stop when a routine goes feral. Views here are mine. This is how I think about the problem, not a company announcement.

Cursor, scripts, one-off notebooks, a routine chewing through a ticket. Each wants an API key. Each defaults to whatever is "smart." None of them know what the others already spent today. You can tell people to pick a cheaper model. They won't, not consistently. You need a place that decides for them.

It sits in front of the providers. Clients still speak the usual OpenAI-shaped API. They point at Conduit instead of at OpenAI or Anthropic directly. Then it can route a job to a small model when the prompt does not need a frontier one, fail over if a provider is down instead of the editor just dying, count tokens and money per key, per team, per day, and refuse the request when a budget is blown, not after. The interesting part is not the proxy. The interesting part is that Cursor, the routines, and a random script all look like the same kind of client. One policy.

I don't pick a model in every chat. The gateway has aliases. "Default" is something cheap enough for boilerplate. If I need the expensive one, I ask for it on purpose. Routines get their own keys, with tighter limits than my laptop. If a planner-selected ticket sends a routine into a loop, Conduit is the thing that says no. I would rather a failed job than a surprise invoice. Logging is the other half. When a week looks expensive, I want to see which key did it, not a single opaque number from the vendor.

Personal projects stay on personal keys. Home lab and OpenClaw are not work traffic. Mixing those was how I used to lose track of spend, and also how you accidentally put the wrong context on the wrong account. Conduit is for work. Everything else has its own door.

Workflow at work has a cost line. Skills and planners are cute until the finance person asks what happened. I'd rather the answer be "here is the gateway, here is the cap" than "we will look into it."
