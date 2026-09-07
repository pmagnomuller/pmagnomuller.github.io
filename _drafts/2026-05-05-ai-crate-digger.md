---
title: "AI Crate Digger: A Shop Companion When the Counter Is Busy"
date: 2026-05-05
description: "Building an AI vinyl companion for crate digging — semantic search over a real catalog, mood and budget chat, and recommendations grounded in titles you can actually pull."
categories:
  - Projects
tags:
  - AI Crate Digger
  - Vinyl
  - NestJS
  - Semantic Search
  - Azure OpenAI
toc: true
---

Record shops are magic until the Saturday rush hits and nobody has ten minutes to talk crates with you.

[AI Crate Digger](https://github.com/pmagnomuller/ai-crate-digger) is a pocket companion for that moment: ask for something like a record, a mood under a budget, or "more along these lines" — and get answers grounded in **a real vinyl catalog**, not generic model inventiveness.

## The idea

Fuzzy taste ("warm deep house for a sunset") is easy to say and hard to search. Discogs-style metadata helps, but the useful layer is semantic: embed the catalog, retrieve candidates, then let a chat agent explain picks with tools that can actually look records up.

## What you get

- **Chat-style recommendations** — mood, genre, budget, similar-to-X
- **Streaming answers** — SSE chat with vinyl-focused prompting
- **Semantic search** — embeddings over MongoDB-backed records (seeded from Discogs)
- **Taste bias (optional)** — Spotify likes to tilt retrieval toward what you already play
- **Tool use** — `search_records`, `get_record_detail`, taste profile, recommend-for-me — including parallel tool calls when several lookups fire at once

## Stack

NestJS · MongoDB · Azure OpenAI · a small Vite client for local digs · Docker · CI toward Azure Container Apps.

The important constraint: recommendations must point at **titles in the catalog**. Hallucinated pressings are worse than silence in a shop.

## Why build it

I care about music discovery that stays local to a collection — a shop's bins, or eventually a digger's own shelves. The agent is useful only if it respects inventory and taste, then gets out of the way so you can flip wax.

## Status

Still a working lab: seeding, retrieval quality, and how much Spotify should influence shop-floor picks. This post is the stake in the ground — more build notes as the recommendations get trustworthy enough to trust with a Saturday afternoon.
