---
title: "Starting My Homelab Journey"
date: 2026-06-02
description: "Why I'm building a home lab in Berlin — private AI, energy automation, and a place to run things I actually own."
categories:
  - Homelab
tags:
  - Homelab
  - Self-hosting
  - OpenClaw
  - Energy
  - AI
toc: true
---

For years I treated "the cloud" as the default place to run anything interesting. Lately I've been pulling more of that work back home — not out of nostalgia for racks and blinking lights, but because the projects I care about want **persistence, privacy, and proximity to real devices**.

This post kicks off a series on that shift: the home lab, the [OpenClaw](https://docs.openclaw.ai/) instance that sits on top of it, and the AI coding setup that ties the day job to the evening tinkering.

## Why a lab, why now

Three threads kept colliding:

1. **Energy work that needs to live near the meter.** Spot prices, load shifting, heat pumps, batteries — the interesting part is not another dashboard. It is an agent that can *act* when prices drop or the grid gets greener. That wants something always on, on my network, with skills I control.
2. **AI that does not evaporate between chats.** Cloud assistants are great until the session ends. A self-hosted gateway keeps memory, tools, and channel bindings in one place I can back up.
3. **A sandbox for messy experiments.** Ollama models, Home Assistant hooks, scrapers, cron jobs that should not share a laptop with my day job. The lab is where those get to be loud.

I work on energy and clean-tech software for a living. The lab is where that domain stops being slides and starts being "turn the boiler on when OMIE says Portugal is cheap."

## What "homelab" means here

I am not chasing a datacenter in a closet. The bar is simpler:

- One always-on Linux host (or a small cluster later) I can reach over a private mesh
- Services bound to loopback by default — reach them via Tailscale / SSH, not the open internet
- Clear separation between **toys**, **tools**, and **things that can switch real loads**
- Backups I would actually restore from

Security is not a later chapter. Anything that can run shell commands against smart-home hardware gets dry-run defaults, allowlists, and secrets that never leave local config.

## The stack I am growing into

Exact hardware will show up in follow-ups once it stops changing week to week. Conceptually the lab is three layers:

| Layer | Job |
| --- | --- |
| **Compute** | Host for containers, local models, and the OpenClaw Gateway |
| **Access** | Private mesh (Tailscale-style) so phones and laptops reach the lab without port-forwarding theatre |
| **Agency** | OpenClaw + skills for energy, home automation, and coding assistants |

OpenClaw is the piece that made the lab feel like more than "another server." It turns the box into something I can message from Telegram (or Discord, or whatever channel wins that week) and get an agent that already knows my tools.

## What I will write about next

This series will stay close to what I am actually running:

- **OpenClaw on the lab** — Gateway setup, skills, and how energy automation plugs in ([next post](/homelab/openclaw-on-my-homelab/))
- **AI coding setup** — one skills library across Cursor, Claude Code, and Codex ([follow-up](/ai/my-ai-coding-setup/))
- Hardware choices, failure modes, and the boring ops that keep the lights on

If you already self-host: I would love to steal your hard-won defaults. If you are curious but stuck on the first machine: start with one always-on box, one private VPN, and one service you check every day. Expand only when that feels boring.

Next up: how OpenClaw sits in the middle of all of this.
