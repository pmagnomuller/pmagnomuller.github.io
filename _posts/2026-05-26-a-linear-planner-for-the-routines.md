---
title: "A Linear planner for the routines"
date: 2026-05-26
description: "I pick which Linear tickets are fair game. Routines take them from there. I stay the dispatcher."
categories:
  - AI
tags:
  - Linear
  - Cursor
  - Agents
  - Productivity
  - AI
toc: false
---

Keeping one ticket in the editor is the easy case. This is the next problem: I have a Linear board full of tickets, and a set of routines that can actually work them. If I let the routines grab whatever they want, they grab the wrong thing. If I sit in every session, I am back to being the integration layer.

So I built a planner in the middle. I look at Linear. I select the tickets that are allowed to move. The routines only touch that set.

A ranked daily plan is useful. I already have a triage skill that pulls assigned issues and open PRs. Ranking is not the same as permission. Some tickets need a conversation. Some are "please don't touch the billing code on a Sunday." Some are perfect for a routine: clear acceptance criteria, tests nearby, no political landmines. I want to point at five issues and say: these. Not the whole board. Not whatever looks easy to a model.

Nothing fancy. Linear stays the source of truth. The planner is a short list I maintain: tickets I have marked as fair game for agent work. A routine — read the issue, look at the repo, implement, open a PR — only starts if the ticket is on that list. If it isn't, it waits. That sounds obvious. It is also the difference between "AI is helping" and "AI opened three PRs I now have to unwind."

A morning looks like this. Open Linear. Skim what is actually mine today. Mark a few as routine-ready, the ones with a shape I trust: small, tested, boring. Let the routines pick from that list. I am not watching the keystrokes. Review the PRs like I would review a colleague. Merge is still me. If the list is empty, nothing runs. That is a feature.

I don't let a routine choose whether a ticket is safe. That is the whole point of the planner. I also don't let it merge, and I don't let it pick work that needs a product call. The routines are good at the middle. I keep the start and the end.

Skills are how the work gets done. The planner is how I decide which work is even allowed. A work LLM gateway is how those runs stay on a budget.
