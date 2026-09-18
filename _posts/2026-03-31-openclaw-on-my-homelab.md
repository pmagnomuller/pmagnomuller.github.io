---
title: "OpenClaw on My Homelab: A Personal Agent That Can Touch the Grid"
date: 2026-03-31
description: "How I run OpenClaw as a self-hosted gateway. Messaging in, energy skills out, and why ClawHub skills matter for real automation."
categories:
  - Homelab
tags:
  - OpenClaw
  - Homelab
  - Energy
  - ClawHub
  - Self-hosting
  - Agents
toc: false
---

[OpenClaw](https://docs.openclaw.ai/) is why my home lab stopped being a place to park containers and became something I talk to from my phone.

It is a self-hosted gateway: one process that connects chat channels — Telegram, Discord, WhatsApp, Slack, whoever wins that week — to an AI agent with tools, memory, and sessions. You message it. It runs on your hardware. The Gateway owns state. That last sentence is the one I keep repeating to myself. Cloud chat is a rental. This is a box I can back up.

The shape is almost embarrassingly simple. Phone or laptop reaches the Gateway over a private mesh. The Gateway sits on loopback. From there it owns the channels, the agent runtime, the memory, and the skills. I bind it to loopback on purpose. Tailscale Serve or an SSH tunnel, not a public port. I treat the host as source of truth and back up `~/.openclaw` like I mean it. Skills that can run shell commands stay in dry-run until the thresholds and allowlists are boringly correct. The [official docs](https://docs.openclaw.ai/) cover onboarding well enough — `openclaw onboard`, dashboard on `127.0.0.1:18789` — that I will not rehash the install script. The interesting part is what you hang off the Gateway.

I work in energy software. At home, dynamic tariffs and day-ahead prices are the perfect agent workload: structured data, clear questions, and occasional actions. Start charging now. Don't. Wait two hours. My OpenClaw-facing skills live as standalone packages and on [ClawHub](https://clawhub.ai/pmagnomuller). [`omie-energy`](https://github.com/pmagnomuller/omie-energy) answers Iberian OMIE day-ahead prices for Portugal and Spain, cheapest windows, PT versus ES. [`ostrom-energy`](https://github.com/pmagnomuller/ostrom-energy) does Ostrom spot prices, optimize windows, threshold on and off. [`tibber-energy`](https://github.com/pmagnomuller/tibber-energy) does Tibber prices, consumption anomalies, the same kind of threshold control. They share a shape on purpose, so muscle memory transfers: `prices`, `optimize`, `control`. Credentials stay local. Control paths default to dry-run. `--execute` is explicit. Thresholds are always EUR/kWh, even when the upstream market talks in megawatt-hours.

The wider catalog — battery arbitrage, heat-pump load shift, carbon-intensity scheduling — lives in my [skills](https://github.com/pmagnomuller/skills) library. OpenClaw gets the automation surface. Cursor, Claude Code, and Codex get the same recipes when I am writing instead of chatting from the couch.

A useful night looks like this. I message the agent: cheapest three-hour window for Portugal tomorrow? The skill pulls OMIE day-ahead data and returns the window in EUR/kWh. Optionally, after dry-runs stop surprising me, a threshold can fire a trusted command — charger, dishwasher relay, whatever is actually wired. That is the whole point of putting OpenClaw on the lab. Chat as the UI. My network as the runtime. Skills as the contract.

A few things I wish I had treated as non-negotiable from day one. One trust boundary: shared company agents and the personal home agent do not share an OS user, an Apple or Google login, or a password manager profile. Channels are attack surface — pairing, allowlists, require-mention in groups. Skills are code, so a ClawHub install is a dependency: read the `SKILL.md`, prefer publishers I recognize, keep secrets out of the repo. And observe before you optimize. Log price fetches and dry-run decisions for a week. Only then wire real actuators.

Packages are on [ClawHub `@pmagnomuller`](https://clawhub.ai/pmagnomuller) and the GitHub links above.
