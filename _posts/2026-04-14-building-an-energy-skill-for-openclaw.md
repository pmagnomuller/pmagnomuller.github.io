---
title: "Building an Energy Skill for OpenClaw"
date: 2026-04-14
description: "I wanted to ask my homelab agent what electricity costs tonight. Here is how the skills came together, what broke, and why I still like them."
categories:
  - Homelab
tags:
  - OpenClaw
  - Energy
  - ClawHub
  - Skills
  - OMIE
  - Ostrom
  - Tibber
  - TRMNL
toc: false
---

I got [OpenClaw](https://docs.openclaw.ai/) running at home and the first useful thing I wanted was boring: what does power cost in the next few hours?

Not a dashboard I forget to open. A message from the phone. Cheapest two hours in Portugal tomorrow. Is Ostrom cheap enough to run the washer. That is an agent job. Structured data, a clear question, maybe a later action.

So I built skills for it. They are not perfect. People still installed them. [ClawHub](https://clawhub.ai/pmagnomuller) shows about **1.5k downloads** across my publisher page, which I did not expect and still makes me a bit giddy. This is how I did it, what broke, and what I want next: prices on a [TRMNL](https://trmnl.com/) e-ink screen so I don't even have to ask.

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

Asking the agent from the phone was the whole point, and it actually works. Prices for Portugal, next 36 hours. It runs `run.sh prices`, I get numbers. One CLI for three providers meant adding Tibber was copy-and-adapt, not a new product. No-auth OMIE as the demo is probably why it spread more than the credentialed ones. I published on ClawHub because I use the registry. Seeing downloads stack up was the unexpected part. The skills are small. People still wanted to ask an agent about prices.

Units get me every time. Market is MWh, humans think kWh. Get that wrong once and every threshold is off by a thousand. Tomorrow's curve is not there in the morning — OMIE publishes in the afternoon — so early "what's cheap tomorrow?" answers look short unless you wait or widen the window. DST can expose an extra `H25` hour. I documented it. I still would not bet a heat pump on my first parser. Ostrom and Tibber auth is fine on my machine and annoying in a clean install. Missing env, the skill should fail loudly. Sometimes the agent retries with a fictional token. `--prompt-missing-secrets` exists because I got tired of that.

`optimize` is a contiguous cheapest window. No battery state of charge, no "don't start the heat pump if nobody is home," no carbon versus price. Useful. Not an energy management system. Control against real hardware is still the scary bit. Dry-run logs are honest. `--execute` with a Home Assistant switch is how you get a 3am dishwasher. The skills will let you do it. They should not be the only safety layer. ClawHub packaging is fussy: include `SKILL.md` and `run.sh`, exclude `.env`, test from a clean shell. Skip that test and you publish a skill that only works on your laptop.

They can be improved. I want better windows, better auth errors, maybe a single engine with provider adapters instead of three near-copies. I am not embarrassed they shipped in this shape. I am glad people are using them while they are still rough.

I don't want to unlock a phone to know if this hour is cheap. I have a [TRMNL](https://trmnl.com/), the little e-ink dashboard. Next I want to wire the same price fetch into a custom plugin: always-on, low-distraction, today's curve and the cheapest window, sitting on a shelf. OpenClaw stays the thing I talk to. TRMNL stays the thing I glance at. Same data, two doors.

If you want the skills: GitHub links above, or [ClawHub `@pmagnomuller`](https://clawhub.ai/pmagnomuller). Start with `omie-energy` if you have no tokens. Read the `SKILL.md` before you let `--execute` near anything that plugs into a wall.
