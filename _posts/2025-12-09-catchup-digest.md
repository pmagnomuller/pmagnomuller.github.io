---
title: "Catchup Digest: Newsletters on Your Schedule"
date: 2025-12-09
description: "A small product tryout with two friends: one AI-summarized newsletter digest on your clock, Gmail and Outlook support, real users, and the inbox-scope audits that stopped us."
categories:
  - Projects
tags:
  - Catchup Digest
  - Newsletters
  - FastAPI
  - Next.js
  - Gmail
  - Outlook
  - OpenAI
toc: false
---

I like newsletters. I do not like opening my inbox at 11pm to a pile of them and telling myself I will catch up this weekend. That weekend never comes. The unread count just becomes another thing I feel vaguely guilty about.

[Catchup Digest](https://github.com/pmagnomuller/catchup-digest) was our attempt to fix that. Not a solo side project I polished forever. A real tryout with **two friends**: build something people would actually use, see if they would pay, learn fast. They leaned into distribution and got people in the door. I built the product. Safe to say at least **twenty people** connected an inbox and received digests.

## The idea

Instead of ten newsletter emails fighting for attention, you get **one**. A summary of the newsletters you chose, at a time you picked. The writers keep their cadence. You get yours.

You could connect **Gmail or Outlook**. That login was the whole consent story: we asked for the scopes to **read your mail**, found the newsletters in your inbox, let you pick which ones still deserved a slot, and emailed you a digest on a schedule. The point was never to become another feed. It was to collapse the pile into something you could finish with coffee.

## How we found the newsletters

Detection was half AI, half boring rules. An OpenAI call (we used **GPT-4o-mini**, the cheap one) helped classify mail as newsletter-shaped or not. On top of that I layered simple signals: headers that say it is a newsletter, senders you already get on a weekly rhythm, the usual unsubscribe tells. Together that was enough to pull a credible list from a real inbox without making people hand-label everything.

Under the hood it was straightforward. **FastAPI** backend, **Next.js** frontend, hosted on **Railway**. Cost was basically nothing while we were small. The OpenAI key sat on the backend. Google and Microsoft OAuth on the front of the flow. Ingest, filter, summarize, send.

## What we learned before we stopped

Distribution worked better than I expected for a first version. People tried it. Digests went out. We started poking at willingness to pay. Then the wall appeared.

Because we asked for permission to **read email**, both providers put us in sensitive-scope territory. For Google that meant a proper OAuth verification / security assessment on the order of **about $1,500**. Outlook had the same class of problem: mail-read scopes, publisher verification, the whole compliance path. For a tryout that was still finding its feet, that was real money. Around the same time one of the co-founders went quieter. Momentum dropped. And even if we had paid, I kept hearing the same resistance in conversations: a lot of people, especially in Germany, will not grant an app the right to read their inbox. I talked to CEOs and other operators about the problem. The pain is real. The trust tax on "let us read your mail" is also real.

So we stopped there. Not because the digests were bad. Because the next step was certification money plus a privacy posture that fights the product shape.

## What I take from it

Catchup Digest proved the boring version of the idea works. Aggregate, summarize, deliver on the user's clock. Users will try it if you make the first digest easy. The hard part is not the summary model. It is **inbox access**, compliance cost on Gmail and Outlook alike, and whether people will ever feel okay granting that scope.

I still have notes on how I would reshape the product without asking for the whole mailbox. Maybe you will see a descendant of this later. For now this post is the honest version: a small team, a working slice, real users, and a hard stop at the inbox providers' gate.

I will add screenshots when I dig them up.
