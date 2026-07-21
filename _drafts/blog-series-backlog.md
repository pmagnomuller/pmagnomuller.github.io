---
title: "Blog series backlog (unpublished)"
date: 2026-07-21
description: "Editorial backlog for homelab / OpenClaw / AI coding posts. Not for publish."
---

# Series backlog

Cadence target: **Tuesdays**. Alternate themes so the feed is not three OpenClaw posts in a row.

## Published

| Date | Post | Theme |
| --- | --- | --- |
| 2026-07-07 | Starting My Homelab Journey | Homelab |
| 2026-07-14 | OpenClaw on My Homelab | OpenClaw |
| 2026-07-21 | My AI Coding Setup | AI coding |

## Next up (outlined drafts in `_drafts/`)

| Target date | Working title | Theme |
| --- | --- | --- |
| 2026-07-28 | Tailscale + OpenClaw: Keep the Gateway Invisible | Homelab / security |
| 2026-08-04 | Building an Energy Skill for OpenClaw | OpenClaw / energy |
| 2026-08-11 | Anatomy of a Multi-Agent Skill | AI coding |
| 2026-08-18 | Dry-Run First: Price Thresholds That Won't Surprise You | Energy / safety |

## Idea bank

### Homelab

- **Hardware that earned its keep** — first always-on box, what I'd skip buying again
- **Backups you'd actually restore** — OpenClaw state, Docker volumes, restore drill
- **Observability without a NOC** — minimal metrics/logs for Gateway + skills
- **Home Assistant ↔ OpenClaw** — who owns actuators, who owns chat
- **Lab network layout** — VLANs / trust zones for IoT vs agent host

### OpenClaw

- **Channels worth enabling first** — Telegram vs Discord vs WhatsApp for a personal agent
- **Memory and sessions in practice** — what sticks across days, what shouldn't
- **Publishing on ClawHub** — packaging, trust, lessons from real downloads
- **Cron + webhooks** — morning price briefing without opening the dashboard
- **Multi-agent routing** — separate home vs coding vs energy personalities

### Energy skills

- **Provider-agnostic spot optimizer** — one engine, many tariffs (aWATTar / Tibber / Ostrom / OMIE)
- **Battery arbitrage skill walkthrough** — inputs, plan, estimated savings
- **Heat-pump load shift** — comfort constraints vs cheapest hours
- **Carbon vs price** — when greenest ≠ cheapest, and how the skill decides
- **OMIE PT vs ES** — why comparing Iberian areas is useful

### AI coding

- **Finish the Cursor story** — rewrite/complete the Feb 2025 Cursor post with real workflow
- **Worktree fan-out** — parallel agents without merge chaos
- **Fix-CI as an agent loop** — from failed Actions URL to green
- **Cloud Agents vs laptop Cursor** — when to ship the task off-machine
- **MCP ticket → PR deep dive** — Jira/Notion/GitHub without tab thrash
- **Skill triggers that fire** — writing `description: Use when…` so agents pick the right skill
- **Conventional commits from the staged diff** — small skill, big daily payoff

### Crossovers (highest leverage)

- **One skill, four runtimes** — OpenClaw + Cursor + Claude Code + Codex from one `SKILL.md`
- **Evening energy, daytime code** — same agent vocabulary across contexts
- **What I refuse to automate** — merge, money, and anything that can start a fire
