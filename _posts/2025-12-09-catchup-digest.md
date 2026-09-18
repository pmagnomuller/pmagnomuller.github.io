---
title: "Catchup Digest: Newsletters on Your Schedule"
date: 2025-12-09
description: "How I'm building Catchup Digest, a Gmail-connected newsletter aggregator that emails you an AI-summarized digest when you actually have time to read."
categories:
  - Projects
tags:
  - Catchup Digest
  - Newsletters
  - FastAPI
  - Next.js
  - Gmail
toc: false
---

I like newsletters. I do not like opening Gmail at 11pm to a pile of them and telling myself I'll catch up this weekend. That weekend never comes. The unread count just becomes another thing I feel vaguely guilty about.

Catchup Digest is me trying to fix that for myself. Connect Gmail, find the newsletters you actually get, pick which ones still deserve attention, and get one AI-summarized email at a time you chose. The senders keep their cadence. I get mine.

The idea is almost boring, which is why I wanted to own it. Newsletters are useful and badly timed. They arrive when the writer hits publish, not when I have twenty quiet minutes. Batching them into a single scheduled digest is not a research problem. It is infrastructure I kept wishing existed in a shape I trusted: read-only Gmail, an explicit connect I can revoke, and a delivery time I set.

What it does in practice is simple. You log in with Google, it scans for newsletter-shaped mail — unsubscribe links, sender patterns, the usual tells — and you choose what makes the cut. Then it shows up as one email instead of twenty tabs. Under the hood that is a FastAPI backend, a Next.js frontend, PostgreSQL for accounts and schedules, and the Gmail API for ingestion, sitting in a monorepo under `apps/api` and `apps/web`. I care less about the stack sounding modern than about three things holding: consent stays narrow, selection stays intentional, and the digest actually arrives when it said it would. A late digest is worse than no digest.

This is an active build, not a finished product. I am writing about it because the problem is mine and the shape is clear enough to share: aggregate, summarize, deliver on my clock. If your inbox looks like mine, you already know why.
