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
toc: true
---

I used to treat each AI coding tool as its own island. Cursor rules here, Claude prompts there, Codex habits somewhere else. That does not scale. The setup that stuck is simpler: **write a skill once, expose it everywhere**, and keep the busywork (tickets, docs, PRs) inside the editor via MCP.

This is the coding half of the same story as the [OpenClaw](/homelab/openclaw-on-my-homelab/) post. Agents at home automate energy. Agents at the keyboard automate the software loop.

## The shape of the setup

Three surfaces, one library:

| Surface | Role |
| --- | --- |
| **Cursor** | Day-to-day editor agent, MCP, Cloud Agents |
| **Claude Code** | Terminal-native agent + marketplace plugins |
| **Codex** | Alternate coding agent with the same skill folders |

The library is [`pmagnomuller/skills`](https://github.com/pmagnomuller/skills). A plugin marketplace, not a pile of dotfiles. Claude Code installs it via `/plugin marketplace add`. Codex and Cursor point at the same `./skills/` tree through their plugin manifests. A skill is one folder with a `SKILL.md`. Write it once.

Categories mirror how I actually work:

- **Energy:** Tibber, Ostrom, OMIE, carbon scheduling, battery / heat-pump helpers (same family that powers OpenClaw)
- **Engineering:** conventional commits, PR review loops, fix-CI, worktree fan-out, docs sync, ClickHouse, OTel
- **Productivity:** daily triage across Linear issues and open PRs

Credentials stay local. Skills that call APIs read env vars or `~/.config/<skill>/config.json`. Never commit `.env`.

## Cursor as the cockpit

I wrote earlier about [Cursor as a pair-programming surface](/cursor-as-your-tool/). The practical layer on top is a reusable workflow template: [`ai-workflow-cursor-config`](https://github.com/pmagnomuller/ai-workflow-cursor-config).

Instead of bouncing between Jira, Notion, and GitHub, the editor owns the loop:

- **"Start task [ticket URL]"**: pull context, prepare the workspace, sketch implementation steps
- **"Update documentation"**: sync code changes into Notion pages
- **"Open PR"**: branch, description, links, the boring checklist

Jira and Notion authenticate through MCP with browser OAuth. GitHub stays in Cursor's native integration with a PAT. The point is not "AI writes everything." It is fewer tab switches, so you spend attention on the hard decisions.

## What I keep when models change

Models change. The workflow shouldn't have to. What I keep:

1. **Write it down.** If I ask for the same procedure twice, it becomes a `SKILL.md` with a trigger ("Use when…").
2. **Same skill, many runtimes.** OpenClaw, Cursor, Claude Code, Codex. Different UIs, shared contracts.
3. **Dry-run by default** for anything that changes the world. Energy control, CI, git automation.
4. **I still merge.** Agents draft PRs and reviews. Production stays on me.

## A normal coding day

Rough rhythm:

1. Morning triage skill ranks Linear + open PRs.
2. Start a ticket from Cursor. The agent sketches the change against repo conventions.
3. Implement with skills for commits, reviews, and CI failures when things break.
4. Open the PR from the editor. Docs sync if the change touches managed markdown.
5. Evening: same energy skills via OpenClaw on the lab for home load decisions. Not a separate brain, just a different channel.

That continuity is the goal. The agent that knows how I review a PR should not be a stranger to the agent that knows when Portugal's day-ahead price is cheap.

## The repos

They're public:

- [skills](https://github.com/pmagnomuller/skills): install as a plugin, treat domain skills as templates
- [ai-workflow-cursor-config](https://github.com/pmagnomuller/ai-workflow-cursor-config): MCP + rules starter for ticket to PR loops
- Energy packages on [ClawHub](https://clawhub.ai/pmagnomuller) if you want the OpenClaw side

Fork it, delete what you don't use, rewrite the triggers for your stack. It only works if it matches how you actually work.

## What I will dig into next

How I actually dispatch work: a [Linear planner](/ai/a-linear-planner-for-the-routines/) where I select tickets, then routines take them. And [Conduit](/ai/conduit/), the work gateway that keeps those calls from each burning their own pile of tokens.

For now: one library, three agents, fewer tabs.
