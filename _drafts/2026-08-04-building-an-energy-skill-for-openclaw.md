---
title: "Building an Energy Skill for OpenClaw"
date: 2026-08-04
description: "Walk through how an OpenClaw energy skill is shaped — CLI contract, dry-run control, and packaging for ClawHub."
categories:
  - Homelab
tags:
  - OpenClaw
  - Energy
  - ClawHub
  - Skills
toc: true
---

<!-- DRAFT — promote to _posts/ when ready -->

## Angle

Practical build post using `omie-energy` / `ostrom-energy` / `tibber-energy` as the pattern: one skill shape that works from chat and from a terminal.

## Outline

1. **The contract** — `prices` / `optimize` / `control` (+ optional `compare` / `anomalies`)
2. **Units that don't lie** — EUR/MWh vs EUR/kWh; thresholds always in kWh terms
3. **Secrets stay local** — `.env` vs `~/.config/<skill>/config.json`
4. **SKILL.md that agents can find** — trigger description, examples, safety section
5. **Dry-run before `--execute`** — on/off commands as trusted strings only
6. **Ship it** — standalone repo + ClawHub; what I check before publish
7. **Demo script** — Portugal cheapest 2h window → optional control dry-run

## Notes / links

- https://github.com/pmagnomuller/omie-energy
- https://github.com/pmagnomuller/ostrom-energy
- https://github.com/pmagnomuller/tibber-energy
- https://clawhub.ai/pmagnomuller
