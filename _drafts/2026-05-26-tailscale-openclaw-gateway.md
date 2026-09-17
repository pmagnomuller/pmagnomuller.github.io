---
title: "Tailscale + OpenClaw: Keep the Gateway Invisible"
date: 2026-07-21
description: "Bind OpenClaw to loopback, expose it only on your tailnet with Tailscale Serve, and skip public ports."
categories:
  - Homelab
tags:
  - OpenClaw
  - Tailscale
  - Homelab
  - Security
  - Self-hosting
toc: true
---

<!-- DRAFT — promote to _posts/ when ready -->

## Angle

Security-first follow-up to the OpenClaw intro: how the Gateway stays off the public internet while still reachable from phone and laptop.

## Outline

1. **Why loopback is the default** — lan/funnel temptation vs actual threat model
2. **Tailscale Serve vs Funnel** — private mesh vs public HTTPS; when Funnel is a bad idea for a home agent
3. **Minimal config sketch** — `gateway.bind: loopback`, auth token/password, `tailscale.mode: serve`
4. **Verify from outside** — fail from public IP, succeed from another tailnet device
5. **Ops extras** — UFW still useful, MagicDNS names, backing up Serve config assumptions
6. **What not to do** — open 18789 on the router, shared passwords in chat, Funnel "just for testing"

## Notes / links

- https://docs.openclaw.ai/ (remote access / Tailscale)
- Tie back to [/homelab/openclaw-on-my-homelab/](/homelab/openclaw-on-my-homelab/)
