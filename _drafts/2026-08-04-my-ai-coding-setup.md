---
title: "My AI Coding Setup: One Skills Library, Three Agents"
date: 2026-08-04
description: "How I run Cursor, Claude Code, and Codex from a shared skills plugin — plus MCP workflows that keep tickets, docs, and PRs in the editor."
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

I used to treat each AI coding tool as its own island. Cursor rules in one place, Claude prompts in another, Codex habits somewhere I would forget. That does not scale, and it made me worse at the thing I actually wanted: a procedure I could trust, written once, available wherever I happened to be typing.

The setup that stuck is simpler. Write a skill once, expose it everywhere, and keep the busywork — tickets, docs, PRs — inside the editor. This is the coding half of the same story as the [homelab](/homelab/starting-my-homelab-journey/) and [OpenClaw](/homelab/openclaw-on-my-homelab/) posts. Agents at home automate energy. Agents at the keyboard automate the software loop.

Cursor is the day-to-day editor. Claude Code is the terminal-native one. Codex is the alternate, pointed at the same folders. The library is [`pmagnomuller/skills`](https://github.com/pmagnomuller/skills), a plugin marketplace rather than a pile of dotfiles. Claude Code installs it with `/plugin marketplace add`. Codex and Cursor look at the same `./skills/` tree through their manifests. A skill is one folder with a `SKILL.md`. Write it once.

The categories mirror how I actually work, not how a marketplace wants to be organized. Energy — Tibber, Ostrom, OMIE, carbon scheduling, battery and heat-pump helpers, the same family that [powers OpenClaw](/homelab/building-an-energy-skill-for-openclaw/). Engineering — conventional commits, PR review loops, fix-CI, worktree fan-out, docs sync, the ClickHouse and OTel stuff I keep relearning. Productivity — morning triage across Linear issues and open PRs. Credentials stay local. Skills that call APIs read env vars or config under `~/.config`. Never commit `.env`. I have said that in three posts now and I will probably say it again.

Cursor is the cockpit. I care less about the model of the week than about a loop I do not have to leave. [`ai-workflow-cursor-config`](https://github.com/pmagnomuller/ai-workflow-cursor-config) is the reusable template for that: start a task from a ticket URL, update documentation when the code moved, open a PR without assembling the checklist by hand. Jira and Notion through MCP with browser OAuth. GitHub stays in Cursor's native integration. The point is not that AI writes everything. It is fewer context switches, so attention goes to the hard decisions. I will [write more about Cursor itself](/ai/cursor-as-your-tool/) later. This post is about not fragmenting the skills underneath it.

Models change. Workflows should not thrash with them. If I ask for the same procedure twice, it becomes a `SKILL.md` with a trigger that starts with "Use when…". Same skill, many runtimes — OpenClaw, Cursor, Claude Code, Codex — different UIs, shared contracts. Dry-run defaults for anything that mutates the world, especially energy control and git automation. Human review on the boundary. Agents draft. I still own merge.

A normal day is less cinematic than that paragraph. Morning triage ranks Linear and open PRs. I start a ticket from Cursor. We implement, and when CI breaks there is a skill for that too. The PR opens from the editor. In the evening the same energy skills show up via OpenClaw on the lab, not as a separate brain, just a different channel. That continuity is the goal. The agent that knows how I review a PR should not be a stranger to the agent that knows when Portugal's day-ahead price is cheap.

The repos are public on purpose. [skills](https://github.com/pmagnomuller/skills), [the Cursor workflow config](https://github.com/pmagnomuller/ai-workflow-cursor-config), energy packages on [ClawHub](https://clawhub.ai/pmagnomuller). Fork, delete what you do not use, rewrite the triggers for your stack. A personal skills library only works if it encodes your taste. Next I will go one level down into [what a skill folder actually looks like](/ai/anatomy-of-a-multi-agent-skill/) when three agents have to agree on it.
