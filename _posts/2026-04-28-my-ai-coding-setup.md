---
title: "My AI Coding Setup: One Skills Library, Three Agents"
date: 2026-04-28
description: "How I run Cursor, Claude Code, and Codex from a shared skills plugin, plus MCP workflows that keep tickets, docs, and PRs in the editor."
categories:
  - AI
tags:
  - AI
  - Cursor
  - Claude Code
  - Codex
  - Skills
  - MCP
  - Developer Tools
toc: false
---

I used to treat each AI coding tool as its own island. Cursor rules here, Claude prompts there, Codex habits somewhere else. That does not scale. The setup that stuck is simpler: write a skill once, expose it everywhere, and keep the busywork — tickets, docs, PRs — inside the editor.

This is the coding half of the same story as the [OpenClaw](/homelab/openclaw-on-my-homelab/) post. Agents at home automate energy. Agents at the keyboard automate the software loop.

Cursor is the day-to-day editor. Claude Code is the terminal-native one. Codex is the alternate, pointed at the same folders. The library is [`pmagnomuller/skills`](https://github.com/pmagnomuller/skills), a plugin marketplace rather than a pile of dotfiles. Claude Code installs it with `/plugin marketplace add`. Codex and Cursor look at the same `./skills/` tree through their manifests. A skill is one folder with a `SKILL.md`. Write it once.

The categories mirror how I actually work. Energy: Tibber, Ostrom, OMIE, carbon scheduling, battery and heat-pump helpers, the same family that [powers OpenClaw](/homelab/building-an-energy-skill-for-openclaw/). Engineering: conventional commits, PR review loops, fix-CI, worktree fan-out, docs sync, the ClickHouse and OTel stuff I keep relearning. Productivity: morning triage across Linear issues and open PRs. Credentials stay local. Skills that call APIs read env vars or config under `~/.config`. Never commit `.env`.

Cursor is the cockpit. I wrote earlier about [the talk](/cursor-as-your-tool/). The practical layer on top is [`ai-workflow-cursor-config`](https://github.com/pmagnomuller/ai-workflow-cursor-config): start a task from a ticket URL, update documentation when the code moved, open a PR without assembling the checklist by hand. Jira and Notion through MCP with browser OAuth. GitHub stays in Cursor's native integration. The point is not that AI writes everything. It is fewer tab switches, so attention goes to the hard decisions.

Models change. Workflows should not thrash with them. If I ask for the same procedure twice, it becomes a `SKILL.md` with a trigger that starts with "Use when…". Same skill, many runtimes — OpenClaw, Cursor, Claude Code, Codex — different UIs, shared contracts. Dry-run defaults for anything that mutates the world. I still merge. Agents draft. Production stays on me.

A normal day is less cinematic than that paragraph. Morning triage ranks Linear and open PRs. I start a ticket from Cursor. We implement, and when CI breaks there is a skill for that too. The PR opens from the editor. In the evening the same energy skills show up via OpenClaw on the lab, not as a separate brain, just a different channel. That continuity is the goal. The agent that knows how I review a PR should not be a stranger to the agent that knows when Portugal's day-ahead price is cheap.

The repos are public. [skills](https://github.com/pmagnomuller/skills), [the Cursor workflow config](https://github.com/pmagnomuller/ai-workflow-cursor-config), energy packages on [ClawHub](https://clawhub.ai/pmagnomuller). Fork, delete what you do not use, rewrite the triggers for your stack. It only works if it matches how you actually work.

How I actually dispatch that work is the [Linear planner](/ai/a-linear-planner-for-the-routines/): I select tickets, then routines take them. [Conduit](/ai/conduit/) is the work gateway that keeps those calls from each burning their own pile of tokens. For now: one library, three agents, fewer tabs.
