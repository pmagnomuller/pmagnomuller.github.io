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
toc: true
---

The [routines](/ai/a-linear-planner-for-the-routines/) and the [editor loop](/cursor-as-your-tool/) only work at work if someone is watching the bill. Left alone, every tool talks to a frontier model with its own key. You find out at the end of the month.

Conduit is the gateway I use so that doesn't happen. One door. Work traffic goes through it. Cheaper models where they are enough, spend you can actually see, a stop when a routine goes feral.

Views here are mine. This is how I think about the problem, not a company announcement.

## The problem

Cursor, scripts, one-off notebooks, a routine chewing through a ticket. Each wants an API key. Each defaults to whatever is "smart." None of them know what the others already spent today.

You can tell people to pick a cheaper model. They won't, not consistently. You need a place that decides for them.

## What Conduit does

It sits in front of the providers. Clients still speak the usual OpenAI-shaped API. They point at Conduit instead of at OpenAI or Anthropic directly.

Then Conduit can:

- Route a job to a small model when the prompt does not need a frontier one
- Fail over if a provider is down, instead of the editor just dying
- Count tokens and money per key, per team, per day
- Refuse the request when a budget is blown, not after

The interesting part is not the proxy. The interesting part is that Cursor, the routines, and a random script all look like the same kind of client. One policy.

## How I use it day to day

I don't pick a model in every chat. The gateway has aliases. "Default" is something cheap enough for boilerplate. If I need the expensive one, I ask for it on purpose.

Routines get their own keys, with tighter limits than my laptop. If a planner-selected ticket sends a routine into a loop, Conduit is the thing that says no. I would rather a failed job than a surprise invoice.

Logging is the other half. When a week looks expensive, I want to see which key did it, not a single opaque number from the vendor.

## What I don't put through it

Personal projects stay on personal keys. Home lab and OpenClaw are not work traffic. Mixing those was how I used to lose track of spend, and also how you accidentally put the wrong context on the wrong account.

Conduit is for work. Everything else has its own door.

## Why bother writing this

Because the talk was about workflow, and workflow at work has a cost line. Skills and planners are cute until the finance person asks what happened. I'd rather the answer be "here is the gateway, here is the cap" than "we will look into it."
