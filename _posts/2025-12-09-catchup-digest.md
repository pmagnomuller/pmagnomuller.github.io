---
title: "Catchup Digest: Newsletters on Your Schedule"
date: 2025-12-09
description: "How I'm building Catchup Digest, a Gmail-connected newsletter aggregator that emails you an AI-summarized digest when you actually have time to read."
categories:
  - Projects
tags:
  - Catchup Digest
  - Newsletters
  - FastAPI
  - Next.js
  - Gmail
toc: true
---

I like newsletters. I do not like opening Gmail to a pile of them at 11pm and pretending I'll catch up this weekend.

[Catchup Digest](https://github.com/pmagnomuller/catchup-digest) is my answer: connect Gmail, find the newsletters you actually get, pick which ones matter, and get one AI-summarized digest at a time you choose.

## The problem

Newsletters are useful and badly timed. They arrive when the sender hits send, not when you have time. Batching them into one scheduled email is boring infrastructure, which is exactly the kind of boring I want to own.

## What it does

1. **Login with Google.** Read-only Gmail access.
2. **Scan for newsletters.** Heuristics around unsubscribe links and sender patterns.
3. **Select and schedule.** Choose which sources make the cut and when the digest lands.
4. **Get the digest.** One email with AI summaries instead of twenty tabs.

## Stack

- FastAPI backend (Python)
- Next.js frontend (TypeScript)
- PostgreSQL for accounts, preferences, and schedule state
- Gmail API for ingestion

Monorepo under `apps/api` and `apps/web`. Docs for the security and product decisions as they settle.

## What I care about

- **Consent.** Read-only, explicit connect, easy to revoke.
- **Noise.** Detection is only useful if you still choose what gets in.
- **Delivery.** A digest that arrives late is worse than no digest.

## Status

This is an active build, not a finished product. I'm writing about it because the problem is mine and the shape is clear enough to share: aggregate, summarize, deliver on your clock.

If your inbox looks like mine, you already know why.
