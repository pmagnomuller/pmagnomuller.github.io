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
toc: false
---

The [OpenClaw post](/homelab/openclaw-on-my-homelab/) was about talking to an agent on my network. This one is about making sure nobody else can. I wanted the Gateway on my phone and laptop without ever putting it on the public internet, and I wanted that to be the default rather than a hardening pass I would get to later.

Loopback is the whole idea. The process listens on `127.0.0.1`. From the host's point of view there is no remote caller. From my point of view there is Tailscale Serve, which takes that local port and presents it to other devices on my tailnet over HTTPS, with MagicDNS names I can actually remember. Funnel is the other button, the one that hangs the same thing on the public internet, and it is a bad idea for a home agent that can run skills. "Just for testing" is how 18789 ends up on a router rule you forget.

The temptation is always LAN-open or Funnel-open because both feel like they worked. You opened the dashboard on a phone that was not on Wi-Fi and you felt clever. The threat model is not a movie hacker. It is an exposed gateway with an auth token that leaked into a chat log, or a pairing flow that accepted a stranger in a group, or a skill that can exec. Private mesh first. Auth token or password on the Gateway anyway. UFW still useful, because Tailscale is not an excuse to skip a firewall. Back up the Serve assumptions with the rest of `~/.openclaw` so a reinstall does not quietly fall back to something wider.

I check it the unglamorous way. From a device not on the tailnet, the dashboard should fail. From another tailnet device, it should just work. If both succeed, something is public that I did not intend. If both fail, Serve is not doing what I think. Shared passwords in chat and "I'll lock it down after the demo" go in the same bucket as opening 18789 on the router.

None of this is exotic. It is the difference between an agent I message from the tram and an agent the tram can message. The [docs on remote access](https://docs.openclaw.ai/) are the source of truth for the flags. My version is shorter: bind loopback, Serve not Funnel, and do not get bored and make it easy.
