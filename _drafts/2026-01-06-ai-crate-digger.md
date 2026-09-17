---
title: "AI Crate Digger: A Shop Companion When the Counter Is Busy"
date: 2026-01-06
description: "Building an AI vinyl companion for crate digging. Semantic search over a real catalog, mood and budget chat, and recommendations you can actually pull."
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

Record shops are great until the Saturday rush hits and nobody has ten minutes to talk crates with you.

[AI Crate Digger](https://github.com/pmagnomuller/ai-crate-digger) is for that moment. Ask for something like a record, a mood under a budget, or "more along these lines", and get answers from a **real vinyl catalog**, not whatever the model invented.

## The idea

Fuzzy taste ("warm deep house for a sunset") is easy to say and hard to search. Discogs-style metadata helps, but the useful layer is semantic: embed the catalog, retrieve candidates, then let a chat agent explain picks with tools that can actually look records up.

## What you get

- Chat-style recommendations: mood, genre, budget, similar-to-X
- Streaming answers (SSE) with vinyl-focused prompting
- Semantic search: embeddings over MongoDB-backed records, seeded from Discogs
- Optional taste bias from Spotify likes
- Tool use: `search_records`, `get_record_detail`, taste profile, recommend-for-me, including parallel tool calls when several lookups fire at once

## Stack

NestJS, MongoDB, Azure OpenAI, a small Vite client for local digs, Docker, CI toward Azure Container Apps.

The important constraint: recommendations have to point at **titles in the catalog**. A made-up pressing is worse than saying nothing.

## Why build it

I care about music discovery that stays local to a collection. A shop's bins, or eventually a digger's own shelves. The agent is only useful if it respects inventory and taste, then gets out of the way so you can flip wax.

## Status

Still a working lab. Seeding, retrieval quality, and how much Spotify should influence shop-floor picks. I'll write more as the recommendations get good enough to trust on a Saturday.
