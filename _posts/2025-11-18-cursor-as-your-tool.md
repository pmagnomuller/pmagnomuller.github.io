---
title: "Cursor as Your Tool: A New Workflow for AI-Native Development"
date: 2025-11-18
description: "The talk I gave at Sword AI Summit: how I use Cursor as the place work happens, not another chat window."
permalink: /cursor-as-your-tool/
categories:
  - AI
tags:
  - Cursor
  - AI
  - Sword AI Summit
  - MCP
  - Developer Tools
toc: false
---

This is the writeup of the talk I gave at [Sword AI Summit](https://aisummit.swordhealth.com/) on 15 November 2025. The talk was called **Real AI Workflows for Software Engineers**. [Hello world](/meta/hello-world/) is how that day felt. This is what I actually said.

Most of us still treat AI like a second monitor. Editor on one side, ChatGPT on the other. Ticket in Jira. Docs in Notion. PR in the browser. You spend the afternoon pasting context and hoping nothing got lost. It works. It is also a dumb way to spend a day. The interesting part is not "AI can write a function." It is taking the repetitive loop — read ticket, touch code, update docs, open PR — and keeping it in one place.

[Cursor](https://cursor.com/) puts the model in the editor. Same files, same git, same terminal. You stop copying. The model can see the repo, so you stop explaining the repo. That is the whole pitch. You don't need a new language or a new job title. The editor becomes the place the work happens. I published the setup I use as a template: [`ai-workflow-cursor-config`](https://github.com/pmagnomuller/ai-workflow-cursor-config).

Out of the box, Cursor writes like a generic Stack Overflow answer. Cursor Rules are how you fix that. You tell it how you like tests, commits, names, what not to touch. Project rules live in the repo and travel with the team. User rules are your own habits. I won't rehash the product docs. The point I made on stage is simpler: if you skip this step, the model will keep sounding like everyone else. A little setup here saves you arguing with it later.

[MCP](https://modelcontextprotocol.io/) is how other apps feed context into the model. Tickets, docs, a browser. You don't paste a Jira page into the chat. You say "start this ticket" and it can fetch it. Without MCP you are still the integration layer. With it, the editor can reach Jira, Notion, and GitHub without you playing courier. In my setup Jira and Notion go through MCP with browser login, and GitHub stays in Cursor's own integration with a personal access token. Then the loop is just English. Start task, with a ticket URL. Update documentation. Open the PR: branch, description, links, the boring checklist. The model does not merge. I do. That part is not optional.

The live bit was the usual: ask Cursor to stand up a small Slack-style chat app. Express backend, a tiny frontend, endpoints for user, channel, message. You can get a prototype up fast. Then you still have to read it. That was the joke and the warning. Demos look magic. Real work is the ticket-to-PR loop above, plus you reviewing the diff.

Setup takes an evening. The first week feels slower, not faster. Some days you revert the whole thing. It stuck for me because the busywork left the browser. Rules made the output look like my code. MCP meant I stopped pasting tickets. Autocomplete was never the interesting part.

If you want the template, fork [ai-workflow-cursor-config](https://github.com/pmagnomuller/ai-workflow-cursor-config) and delete what you don't use. I'll write more later about how this grew into a shared skills library across Cursor, Claude Code, and Codex.
