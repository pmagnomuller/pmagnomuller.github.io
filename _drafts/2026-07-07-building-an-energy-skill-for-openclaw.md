---
title: "Building an Energy Skill for OpenClaw"
date: 2026-07-07
description: "How I shape an OpenClaw energy skill — the CLI contract, dry-run control, and what I check before it goes on ClawHub."
categories:
  - Homelab
tags:
  - OpenClaw
  - Energy
  - ClawHub
  - Skills
toc: false
---

Once OpenClaw was actually running on the lab, the question stopped being "can I talk to a box" and became "what is the first thing I trust it to know." For me that was electricity prices. I already think in those numbers at work. At home I wanted the same question available from the couch: when is Portugal cheap tomorrow, and should anything turn on.

I ended up writing the same skill three times, on purpose. [`omie-energy`](https://github.com/pmagnomuller/omie-energy) for Iberian day-ahead. [`ostrom-energy`](https://github.com/pmagnomuller/ostrom-energy) and [`tibber-energy`](https://github.com/pmagnomuller/tibber-energy) for the retailers I actually have a relationship with. The point of repeating myself was the contract. If every provider has a different CLI, the agent has to relearn how to ask, and so do I.

The shape is small. `prices` fetches the horizon. `optimize` finds a cheap contiguous window, either as a duration or as kWh divided by power. `control` compares the current price to a threshold and maybe runs a command. OMIE also gets `compare` because Portugal versus Spain is a real question on that market. Tibber gets anomalies because consumption spikes are part of that dataset. Everything else is decoration.

Units were the first thing I got slightly wrong. OMIE talks in EUR/MWh. A heat pump and a threshold in my head talk in cents per kilowatt-hour. Divide by a thousand and it looks obvious after the fact. I still force every skill to take thresholds in EUR/kWh so I cannot casually type `0.12` and mean the wrong scale. Muscle memory should transfer. The market can keep its megawatts.

Secrets stay off the repo. OMIE does not even need any, which made it a good first skill — public day-ahead, `OMIEData`, Iberian local time, the occasional `H25` on a DST day if you have not seen that before. Ostrom and Tibber read env vars or `~/.config/<skill>/config.json`. `.env` is local. If a skill cannot run without a committed credential, it is not finished.

The file an agent actually finds is `SKILL.md`. I treat the description as a "use when…" sentence, not a slogan. If the model cannot tell OMIE from Ostrom from a coding skill, the packaging failed. Examples in the skill doc matter more than a README tour. A safety section matters more than both: dry-run is the default, `--execute` is explicit, and `--on-command` / `--off-command` are trusted strings, not something the model is allowed to invent.

```bash
bash run.sh prices --hours 36
bash run.sh optimize --duration-hours 2
bash run.sh control --price-below 0.15 --on-command "echo on" --off-command "echo off"
```

That last line is the one I run for a week before I let it touch hardware. `echo on` is a perfectly good actuator until the logs look boring. Then, and only then, the on-command becomes a Home Assistant service call I wrote myself. Never free-form shell from the chat.

Shipping is a standalone repo plus [ClawHub](https://clawhub.ai/pmagnomuller). Before I publish I want a clean shell to do the obvious things: install requirements, fetch a few hours of PT and ES prices, compare, optimize a two-hour window, dry-run control. Include the skill file, the wrapper, the Python, the requirements, the example env and config. Exclude `.env`, caches, logs. If I cannot run it from a fresh clone, neither can the agent.

A Portugal cheapest-two-hour window is still the demo I use when someone asks what this is for. Chat in, numbers out, optional dry-run on a switch. The [OpenClaw post](/homelab/openclaw-on-my-homelab/) is why the gateway exists. This is what I hung on it first.
