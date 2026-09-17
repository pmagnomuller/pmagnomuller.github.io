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
toc: false
---

The [coding setup post](/ai/my-ai-coding-setup/) was the why. This is the folder.

I used to keep prompts in too many places. A Cursor rule here, a snippet I pasted into Claude, a note I never found again. A plugin beats that because it is installable and versioned instead of a handful of symlinks I stop trusting. [`pmagnomuller/skills`](https://github.com/pmagnomuller/skills) is one repo with a `skills/` tree and a small manifest for each agent: `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`. The skill itself does not care which UI loaded it. It is `skills/<category>/<name>/SKILL.md`.

The frontmatter is the part I used to underthink. `name` has to match the folder or you get a skill that exists and never triggers. `description` is not marketing. It is "Use when…" plus the boundaries — OMIE not Ostrom, prices not a coding review. If two skills could claim the same sentence, one of them needs a sharper description. I bump all the manifests together when the library changes. Forgetting one agent is how you get a week of "why is Codex missing the thing I just wrote."

Categories are just how I work: energy, engineering, productivity. I do not pretend that is a standard. It is a filing system I will actually maintain. The test ritual is similarly unglamorous. Fresh session, ask something that should not trigger, ask something that should, grep the context for secrets that must not appear. Wrong trigger is as useful a failure as a missing file.

Not every coding skill should become an OpenClaw skill. The energy ones translated cleanly because they already had a CLI and a reason to be invoked from the couch. A PR-review loop does not need to live on the Gateway. A price threshold does. The rule I use is boring: if I would text it from my phone, it can be a Gateway skill. If I would only run it with a dirty worktree in front of me, it stays in the editor.

Write once is the slogan. The actual work is keeping three manifests honest and one `SKILL.md` specific enough that the right agent picks it up. That is the whole anatomy.
