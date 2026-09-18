---
title: "OpenClaw on My Homelab: A Personal Agent That Can Touch the Grid"
date: 2026-03-31
description: "How I run OpenClaw at home, then built OMIE, Ostrom, and Tibber skills so I can ask from my phone what power costs tonight — and what broke along the way."
categories:
  - Homelab
tags:
  - OpenClaw
  - Homelab
  - Energy
  - ClawHub
  - Skills
  - OMIE
  - Ostrom
  - Tibber
  - Self-hosting
  - Agents
toc: false
---

[OpenClaw](https://docs.openclaw.ai/) is why my home lab stopped being a place to park containers and became something I talk to from my phone.

It is a self-hosted gateway: one process that connects chat channels — Telegram, Discord, WhatsApp, Slack, whoever wins that week — to an AI agent with tools, memory, and sessions. You message it. It runs on your hardware. The Gateway owns state. That last sentence is the one I keep repeating to myself. Cloud chat is a rental. This is a box I can back up.

The shape is almost embarrassingly simple. Phone or laptop reaches the Gateway over a private mesh. The Gateway sits on loopback. From there it owns the channels, the agent runtime, the memory, and the skills. I bind it to loopback on purpose. Tailscale Serve or an SSH tunnel, not a public port. I treat the host as source of truth and back up `~/.openclaw` like I mean it. Skills that can run shell commands stay in dry-run until the thresholds and allowlists are boringly correct. The [official docs](https://docs.openclaw.ai/) cover onboarding well enough — `openclaw onboard`, dashboard on `127.0.0.1:18789` — that I will not rehash the install script. The interesting part is what you hang off the Gateway.

## Why energy

I work in energy software. At home, dynamic tariffs and day-ahead prices are the perfect agent workload: structured data, clear questions, and occasional actions. Start charging now. Don't. Wait two hours.

The first useful thing I wanted was boring: what does power cost in the next few hours? Not a dashboard I forget to open. A message from the phone. Cheapest two hours in Portugal tomorrow. Is Ostrom cheap enough to run the washer. That is an agent job.

So I built skills for it. They are not perfect. People still installed them. [ClawHub](https://clawhub.ai/pmagnomuller) shows about **1.5k downloads** across my publisher page, which I did not expect and still makes me a bit giddy.

## How the skills are shaped

OpenClaw can run shell commands if you let it. The skill had to be something a model could find and call without inventing `curl` against a random energy site. So each skill is a folder with a `SKILL.md` — when to use it, examples, safety — and a `run.sh` that hides Python. The agent sees English. Underneath it is the same three moves every time:

```bash
bash run.sh prices --hours 36
bash run.sh optimize --duration-hours 2
bash run.sh control --price-below 0.15 --on-command "echo on" --off-command "echo off"
```

Three packages, same shape on purpose. [`omie-energy`](https://github.com/pmagnomuller/omie-energy) for Iberian OMIE day-ahead, Portugal and Spain, no login. [`ostrom-energy`](https://github.com/pmagnomuller/ostrom-energy) for Ostrom spot, API credentials. [`tibber-energy`](https://github.com/pmagnomuller/tibber-energy) for Tibber prices, optional consumption anomalies, a token. I live in Berlin and I am from Portugal. OMIE is the public market I actually understand. Ostrom is the German dynamic tariff I have spent years around. Tibber is the other one people ask about. One contract in the terminal so OpenClaw does not have to learn three APIs.

I started with OMIE because the data is public. [`OMIEData`](https://pypi.org/project/OMIEData/) already wraps the market files. Fetch hours, print a table, find the cheapest contiguous window. No OAuth. If that path is ugly, the agent path will be ugly too. Then I copied the shape to Ostrom and Tibber. Tibber got `anomalies` extra. OMIE got `compare` so I can put PT next to ES. Thresholds always in EUR/kWh, even though OMIE publishes EUR/MWh. That was the first real bug in my head: I almost taught the agent to compare `0.12` against `120` and wonder why the dishwasher never ran.

Secrets stay off git. `.env` locally, or `~/.config/<skill>/config.json` if the skill is installed as a shared package. OpenClaw does not get the keys in the prompt if I can help it. `SKILL.md` is the part that made chat work. The description is a "use when…" so the agent picks `omie-energy` for Portugal prices instead of guessing. Examples in the file are copy-pasteable. If I skip that, the model writes poetry about the grid and zero commands.

Control is dry-run unless you pass `--execute`. On/off are trusted command strings, not something the model may invent. I have not fully wired real loads yet. Dry-run stays on until I trust the numbers. Then I published the repos and pushed them to ClawHub so someone else can `clawhub install` without cloning by hand.

The wider catalog — battery arbitrage, heat-pump load shift, carbon-intensity scheduling — lives in my [skills](https://github.com/pmagnomuller/skills) library. OpenClaw gets the automation surface. Same recipes show up when I am writing instead of chatting from the couch.

## A useful night

I message the agent: cheapest three-hour window for Portugal tomorrow? The skill pulls OMIE day-ahead data and returns the window in EUR/kWh. Optionally, after dry-runs stop surprising me, a threshold can fire a trusted command — charger, dishwasher relay, whatever is actually wired. That is the whole point of putting OpenClaw on the lab. Chat as the UI. My network as the runtime. Skills as the contract.

Asking from the phone was the whole point, and it actually works. One CLI for three providers meant adding Tibber was copy-and-adapt, not a new product. No-auth OMIE as the demo is probably why it spread more than the credentialed ones. Seeing downloads stack up was the unexpected part. The skills are small. People still wanted to ask an agent about prices.

## What broke, what I still watch

Units get me every time. Market is MWh, humans think kWh. Get that wrong once and every threshold is off by a thousand. Tomorrow's curve is not there in the morning — OMIE publishes in the afternoon — so early "what's cheap tomorrow?" answers look short unless you wait or widen the window. DST can expose an extra `H25` hour. I documented it. I still would not bet a heat pump on my first parser. Ostrom and Tibber auth is fine on my machine and annoying in a clean install. Missing env, the skill should fail loudly. Sometimes the agent retries with a fictional token. `--prompt-missing-secrets` exists because I got tired of that.

`optimize` is a contiguous cheapest window. No battery state of charge, no "don't start the heat pump if nobody is home," no carbon versus price. Useful. Not an energy management system. Control against real hardware is still the scary bit. Dry-run logs are honest. `--execute` with a Home Assistant switch is how you get a 3am dishwasher. The skills will let you do it. They should not be the only safety layer. ClawHub packaging is fussy: include `SKILL.md` and `run.sh`, exclude `.env`, test from a clean shell. Skip that test and you publish a skill that only works on your laptop.

A few things I wish I had treated as non-negotiable from day one. One trust boundary: shared company agents and the personal home agent do not share an OS user, an Apple or Google login, or a password manager profile. Channels are attack surface — pairing, allowlists, require-mention in groups. Skills are code, so a ClawHub install is a dependency: read the `SKILL.md`, prefer publishers I recognize, keep secrets out of the repo. And observe before you optimize. Log price fetches and dry-run decisions for a week. Only then wire real actuators.

## What I want next

They can be improved. Better windows, better auth errors, maybe a single engine with provider adapters instead of three near-copies. I am not embarrassed they shipped in this shape. I am glad people are using them while they are still rough.

I don't want to unlock a phone to know if this hour is cheap. I have a [TRMNL](https://trmnl.com/), the little e-ink dashboard. Next I want to wire the same price fetch into a custom plugin: always-on, low-distraction, today's curve and the cheapest window, sitting on a shelf. OpenClaw stays the thing I talk to. TRMNL stays the thing I glance at. Same data, two doors.

If you want the skills: GitHub links above, or [ClawHub `@pmagnomuller`](https://clawhub.ai/pmagnomuller). Start with `omie-energy` if you have no tokens. Read the `SKILL.md` before you let `--execute` near anything that plugs into a wall.
