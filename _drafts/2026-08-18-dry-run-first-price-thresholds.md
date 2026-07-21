---
title: "Dry-Run First: Price Thresholds That Won't Surprise You"
date: 2026-08-18
description: "How I stage OpenClaw energy control — log, dry-run, allowlist, then execute — so cheap hours don't mean chaotic loads."
categories:
  - Homelab
tags:
  - Energy
  - OpenClaw
  - Homelab
  - Safety
  - Automation
toc: true
---

<!-- DRAFT — promote to _posts/ when ready -->

## Angle

Safety / ops post for anyone wiring spot prices to real hardware. The skill is easy; the failure mode is "dishwasher at 3am every night because the threshold was wrong."

## Outline

1. **Separate fetch from act** — a week of `prices` + `optimize` logs before any `--execute`
2. **Threshold design** — absolute EUR/kWh vs percentile; duration vs kWh/kW targets
3. **Command allowlists** — only trusted on/off strings; never free-form shell from the model
4. **Comfort and constraints** — heat pumps and batteries aren't dishwashers
5. **Observability** — what to log so you can explain yesterday's schedule
6. **Rollback** — how to disable control fast when the tariff or skill misbehaves
7. **Checklist** before enabling execute on a new load

## Notes / links

- Control flags in ostrom/tibber/omie READMEs
- Pair with energy skill build post
