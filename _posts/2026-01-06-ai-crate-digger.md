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
toc: false
---

Record shops are great until Saturday hits and nobody behind the counter has ten minutes to talk crates with you. You know the feeling: you can describe what you want — warm deep house for a sunset, something adjacent to a record you already love, a mood under a budget — and the bins do not speak that language. Discogs-style metadata helps if you already know the title. Taste is fuzzier than that.

[AI Crate Digger](https://github.com/pmagnomuller/ai-crate-digger) is a pocket companion for that moment. You ask in chat, it answers from a real vinyl catalog, not from whatever a model feels like inventing. That last part is the whole point. A made-up pressing is worse than silence in a shop. If it cannot point at a title that is actually there, it should shut up.

The useful layer is semantic. Embed the catalog, retrieve candidates, then let a chat agent explain the picks with tools that can actually look records up — search, detail, a taste profile, recommend-for-me, sometimes several of those at once. Mood, genre, budget, similar-to-this. Answers stream back. Optionally, Spotify likes can tilt retrieval toward what you already play, which I am still unsure how much a shop-floor tool should do. A digger's private taste and a shop's bins are not the same collection.

It runs on NestJS, MongoDB, Azure OpenAI, a small Vite client for local digs, Docker, CI pointing at Azure Container Apps. None of that is the interesting constraint. The interesting constraint is inventory. Recommendations have to land on titles you can pull. I care about music discovery that stays local to a collection — a shop's stock, or eventually a digger's own shelves — and then gets out of the way so you can flip wax.

This is still a working lab: seeding, retrieval quality, how much Spotify should be allowed to influence a Saturday afternoon. I will write more as the recommendations get good enough to trust with a real shop.
