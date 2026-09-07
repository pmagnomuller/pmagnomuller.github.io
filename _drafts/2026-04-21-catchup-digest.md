---
title: "Catchup Digest: Newsletters on Your Schedule"
date: 2026-04-21
description: "How I'm building Catchup Digest — a Gmail-connected newsletter aggregator that scans subscriptions and emails you an AI-summarized digest when you actually have time to read."
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

I like newsletters. I do not like opening Gmail to a pile of them at 11pm and pretending I'll "catch up this weekend."

[Catchup Digest](https://github.com/pmagnomuller/catchup-digest) is my answer: connect Gmail, detect the newsletters you actually get, pick which ones matter, and receive one AI-summarized digest at a time you choose.

## The problem

Newsletters are high-signal and badly timed. They arrive on the sender's cadence, not yours. Batching them into a single scheduled email is boring infrastructure — and exactly the kind of boring I want to own.

## What it does

1. **Login with Google** — read-only Gmail access
2. **Scan for newsletters** — heuristics around unsubscribe links and sender patterns
3. **Select & schedule** — choose which sources make the cut and when the digest lands
4. **Get the digest** — one email with AI summaries instead of twenty tabs

## Stack shape

- **FastAPI** backend (Python)
- **Next.js** frontend (TypeScript)
- **PostgreSQL** for accounts, preferences, and schedule state
- Gmail API for ingestion

Monorepo under `apps/api` and `apps/web`, with docs for the security and product decisions as they harden.

## What I'm optimizing for

- **Consent and scope** — read-only, explicit connect, easy to revoke
- **Noise control** — detection is only useful if selection stays intentional
- **Delivery you can trust** — a digest that arrives late is worse than no digest

## Status

This is an active build, not a finished product. I'm writing about it because the problem is personal and the architecture is clear enough to share: aggregate → summarize → deliver on *your* clock.

If you live in newsletter debt too, that's the itch.
