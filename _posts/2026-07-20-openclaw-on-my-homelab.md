---
title: "OpenClaw on My Homelab: A Personal Agent That Can Touch the Grid"
date: 2026-07-20
description: "How I run OpenClaw as a self-hosted gateway — messaging in, energy skills out, and why ClawHub skills matter for real automation."
categories:
  - Homelab
tags:
  - OpenClaw
  - Homelab
  - Energy
  - ClawHub
  - Self-hosting
  - Agents
toc: true
---

[OpenClaw](https://docs.openclaw.ai/) is the reason my home lab stopped being "a place to park containers" and became something I talk to from my phone.

It is a self-hosted gateway: one process that connects chat channels (Telegram, Discord, WhatsApp, Slack, and friends) to an AI agent with tools, memory, and sessions. You message it. It runs on *your* hardware. The Gateway owns state.

This post is how I think about my instance — especially the energy skills that make it useful beyond demos.

## The mental model

```text
Phone / laptop ──(private mesh)──▶ Gateway (loopback)
                                      │
                                      ├─ chat channels
                                      ├─ agent runtime + memory
                                      └─ skills (energy, home, code)
```

Defaults that matter:

- Bind the Gateway to **loopback**. Reach it with Tailscale Serve or an SSH tunnel — not a public port.
- Treat the host as source of truth. Back up `~/.openclaw` (or your container volume) like you mean it.
- Skills that can run shell commands stay in **dry-run** until thresholds and allowlists are boringly correct.

The [official docs](https://docs.openclaw.ai/) cover onboarding well (`openclaw onboard`, dashboard on `127.0.0.1:18789`). I will not rehash the install script here. The interesting part is what you hang off the Gateway.

## Why energy skills

I work in energy software. At home, dynamic tariffs and day-ahead prices are the perfect agent workload: structured data, clear optimization questions, and occasional actions ("start charging now").

My OpenClaw-facing skills live as standalone packages and on [ClawHub](https://clawhub.ai/pmagnomuller):

| Skill | What it answers |
| --- | --- |
| [`omie-energy`](https://github.com/pmagnomuller/omie-energy) | Iberian OMIE day-ahead prices (PT/ES), cheapest windows, PT vs ES compare |
| [`ostrom-energy`](https://github.com/pmagnomuller/ostrom-energy) | Ostrom spot prices, optimize windows, threshold on/off |
| [`tibber-energy`](https://github.com/pmagnomuller/tibber-energy) | Tibber prices + consumption anomalies + threshold control |

They share a shape on purpose:

```bash
bash run.sh prices --hours 36
bash run.sh optimize --duration-hours 2
bash run.sh control --price-below 0.15 --on-command "echo on" --off-command "echo off"
```

Credentials stay local (`.env` or `~/.config/<skill>/config.json`). Control paths default to dry-run; `--execute` is explicit. Thresholds use **EUR/kWh** across providers so muscle memory transfers.

The wider catalog — battery arbitrage, heat-pump load shift, carbon-intensity scheduling — lives in my [skills](https://github.com/pmagnomuller/skills) library. OpenClaw gets the automation surface; Cursor / Claude Code / Codex get the same recipes when I am writing code instead of chatting from the couch.

## A concrete loop

A useful night looks like this:

1. Message the agent: "Cheapest 3-hour window for Portugal tomorrow?"
2. Skill pulls OMIE day-ahead data, returns the window in EUR/kWh.
3. Optionally: schedule or threshold-trigger a trusted command (EV charger, dishwasher relay, whatever you have wired — after dry-runs stop surprising you).

That is the whole point of putting OpenClaw on the lab: **chat as the UI**, **your network as the runtime**, **skills as the contract**.

## Ops notes I wish I had earlier

- **One trust boundary.** Shared company agents and personal home agents should not share the same OS user, Apple/Google login, or password manager profile.
- **Channels are attack surface.** Pairing, allowlists, and "require mention in groups" are not optional polish.
- **Skills are code.** Treat ClawHub installs like dependencies: read the `SKILL.md`, prefer publishers you recognize, keep secrets out of the skill repo.
- **Observe before you optimize.** Log price fetches and dry-run decisions for a week. Only then wire real actuators.

## What is next

Follow-ups will go deeper on Gateway hardening (Tailscale Serve vs Funnel), how I version skills across OpenClaw and coding agents, and the failure modes that only show up at 2am when the tariff flips.

If you want the packages: [ClawHub `@pmagnomuller`](https://clawhub.ai/pmagnomuller) and the GitHub links above. If you want the lab context: [the journey post](/homelab/starting-my-homelab-journey/).

Next: how the same skill mindset shows up in my day-to-day AI coding setup.
