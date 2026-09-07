---
title: "Anatomy of a Multi-Agent Skill"
date: 2026-08-18
description: "One SKILL.md, three agents — how the skills plugin exposes the same folder to Cursor, Claude Code, and Codex."
categories:
  - AI
tags:
  - Skills
  - Cursor
  - Claude Code
  - Codex
  - AI
toc: true
---

<!-- DRAFT — promote to _posts/ when ready -->

## Angle

Deep dive on the plugin layout behind `pmagnomuller/skills`: write once, install per agent, keep manifests in sync.

## Outline

1. **Why a plugin beats dotfiles** — installable, versioned, not symlinked chaos
2. **Repo layout** — `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`, `skills/<category>/<name>/SKILL.md`
3. **Frontmatter that triggers** — `name` matches folder; `description` as "Use when…"
4. **Version discipline** — bump all four manifests together
5. **Categories that mirror work** — energy / engineering / productivity
6. **Test ritual** — fresh session, wrong trigger, right trigger, no secret leakage
7. **Same skill on OpenClaw** — when a coding skill should (and shouldn't) become a Gateway skill

## Notes / links

- https://github.com/pmagnomuller/skills
- Tie to [/ai/my-ai-coding-setup/](/ai/my-ai-coding-setup/)
