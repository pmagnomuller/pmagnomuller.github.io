---
title: "Dry-Run First: Price Thresholds That Won't Surprise You"
date: 2026-09-08
description: "How I stage OpenClaw energy control — log, dry-run, allowlist, then execute — so cheap hours don't mean chaotic loads."
categories:
  - Homelab
tags:
  - Energy
  - OpenClaw
  - Homelab
  - Safety
  - Automation
toc: false
---

The [energy skill](/homelab/building-an-energy-skill-for-openclaw/) is easy. The failure mode is a dishwasher at 3am every night because the threshold was wrong, or a heat pump cycling because I treated it like a relay. I want OpenClaw to touch the grid. I do not want it to surprise me.

So I separate fetch from act. A week of `prices` and `optimize` in the logs, no `--execute`, is not caution for its own sake. It is how I find out that tomorrow's curve was short because OMIE had not published yet, or that I had been thinking in EUR/MWh while the flag wanted EUR/kWh, or that the cheapest window is real and also lands in a hour nobody in the apartment wants a machine on. Cheap is not the same as allowed.

Threshold design is where I still argue with myself. An absolute number — below 0.12 EUR/kWh, go — is easy to explain and easy to get stuck on when the whole week is expensive. A percentile moves with the week and is harder to explain the next morning. Duration versus a kWh target is the other fork: two hours of dishwasher is not the same problem as 28 kWh into a car at 11 kW. The skill can do both. The household has opinions the CLI does not.

Commands are allowlisted strings I wrote. The model does not get a shell. On and off are Home Assistant calls or `echo` until I am bored of `echo`. If a new load cannot be named in a command I already trust, it does not get `--execute`. Heat pumps and batteries are not dishwashers. Comfort constraints, minimum runtimes, state of charge — those belong in the decision before the switch, not in a postmortem.

I log enough to explain yesterday. What price did we see, what window did optimize pick, did control think it was on or off, did it actually fire. When it misbehaves I want a fast off: disable execute, leave fetch running, fix the threshold, do not debug live against a heating cycle. The checklist before a new load is short enough that I cannot pretend I forgot it. A week of dry-run. A command I could read aloud. A rollback I can do half-asleep. Then, maybe, the grid.
