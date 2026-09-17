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
toc: false
---

For years I treated the cloud as the default place to run anything interesting. Lately I have been pulling more of that work back home. Not because I missed racks and blinking lights, but because the projects I care about want persistence, privacy, and proximity to real devices. A laptop that sleeps is a bad place to put an agent that should notice when electricity gets cheap. A chat window that forgets you between sessions is a bad place to put the same.

This is the start of that shift: a home lab in Berlin, the [OpenClaw](https://docs.openclaw.ai/) instance that sits on top of it, and the AI coding setup that ties the day job to the evening tinkering. I will write about it as I actually run it, not as a shopping list.

Three threads kept colliding. Energy work that needs to live near the meter — spot prices, load shifting, heat pumps, batteries. The interesting part is not another dashboard. It is something that can act when prices drop or the grid gets greener, always on, on my network, with skills I control. Then AI that does not evaporate between chats. Cloud assistants are great until the session ends. A self-hosted gateway keeps memory, tools, and channel bindings in one place I can back up. And a sandbox for messy experiments: local models, Home Assistant hooks, scrapers, cron jobs that should not share a laptop with work. The lab is where those get to be loud.

I work on energy and clean-tech software for a living. The lab is where that domain stops being slides and starts being "turn the boiler on when OMIE says Portugal is cheap."

I am not chasing a datacenter in a closet. The bar is simpler. One always-on Linux host I can reach over a private mesh. Services bound to loopback by default, reached through Tailscale or SSH, not the open internet. A clear separation between toys, tools, and things that can switch real loads. Backups I would actually restore from. Security is not a later chapter. Anything that can run shell commands against smart-home hardware gets dry-run defaults, allowlists, and secrets that never leave local config.

Hardware will show up in follow-ups once it stops changing week to week. Conceptually it is three layers. Compute for containers, local models, and the OpenClaw Gateway. Access so phones and laptops reach the lab without port-forwarding theatre. Agency — OpenClaw and skills — for energy, home automation, and coding assistants. OpenClaw is the piece that made the lab feel like more than another server. It turns the box into something I can message from my phone and get an agent that already knows my tools.

Next I will write about [that OpenClaw instance](/homelab/openclaw-on-my-homelab/), then [the energy skill I hung on it](/homelab/building-an-energy-skill-for-openclaw/), and later [the same skill mindset in the editor](/ai/my-ai-coding-setup/). If you already self-host, I would love to steal your hard-won defaults. If you are curious but stuck on the first machine: start with one always-on box, one private VPN, and one service you check every day. Expand only when that feels boring.
