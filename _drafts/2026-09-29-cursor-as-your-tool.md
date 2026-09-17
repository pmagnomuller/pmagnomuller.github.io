---
title: "Cursor as Your Tool"
date: 2026-09-29
description: "How I actually use Cursor — the editor as a pair-programming surface, rules that survive model churn, and MCP so tickets and docs stay in the same place as the code."
categories:
  - AI
tags:
  - Cursor
  - AI
  - MCP
  - Developer Tools
toc: false
---

I used to keep a chat window next to the editor and call that a workflow. It works until you have pasted the same file for the third time, lost the thread, and cannot remember whether the advice still matches the branch you are on. The break was never that the model was weak. It was that the model could not see what I was looking at.

Cursor is the tool that made me stop doing that. Not because it is magic. Because the agent sits in the repo, with the diff, the rules, the terminal, and — if I set it up — the tickets. I have written about [the shared skills library](/ai/my-ai-coding-setup/) and [the shape of a skill folder](/ai/anatomy-of-a-multi-agent-skill/). This is the editor half: what it feels like to treat Cursor as the place work happens, not as a smarter autocomplete.

The thing I protect is context. Cursor Rules are how I stop re-explaining taste. Not a manifesto, just the things I was about to type into the chat again — how we name commits, what not to touch, which skill to reach for. Project rules for the repo, user rules for me. When those are good, the model writes closer to how I would have written, which is the only custom intelligence I actually want. When they are bad, I get confident code in the wrong shape and I have only myself to blame.

MCP is the other piece that made the editor feel like a cockpit instead of a buffer. Tickets, docs, the browser OAuth dance to Jira or Notion, GitHub still in the native integration. "Start task" from a URL, "update the docs" when the code moved, "open the PR" without assembling a checklist in a separate tab. I still bounce out sometimes. I bounce out less.

It is not all upside. A model with too much access and too little constraint will edit the wrong file with perfect manners. Cursor is only as good as the context I give it, and giving it context is work. The payoff, on the days I have done that work, is that I stay in the problem instead of in the plumbing. Pair programming was always the metaphor. The honest version is closer to a very fast junior who has read the repo and will follow the rules if I bothered to write them.

I still own merge. I still read the diff. The tool is the editor. The judgment stays mine.
