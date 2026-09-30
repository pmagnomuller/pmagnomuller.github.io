---
title: "Clean Code Chapter 2: Meaningful Names"
chapter: 2
part: "Principles"
collection: cleancode
---

Names are the primary documentation of code. A good name reveals why it exists, what it does, and how it is used. If you need a comment to explain a name, rename instead.

## Rules of thumb

- Use intention-revealing names (`elapsedTimeInDays`, not `d`)
- Avoid disinformation (`hp`, `list` that isn’t a list, lookalike `O`/`0`/`l`/`1`)
- Make meaningful distinctions — not `a1`/`a2`, not noise pairs like `ProductInfo` vs `ProductData`
- Avoid redundant encodings (`nameString`, `CarObject`, Hungarian prefixes, `m_` members)
- Make names pronounceable and searchable; longer scope → more precise name
- Class names = nouns/noun phrases; method names = verbs/verb phrases
- One word per concept; don’t mix `fetch` / `retrieve` / `get` for the same idea
- Use solution-domain names when the audience is programmers; problem-domain names when the audience is the business
- Add meaningful context (`addrState` over bare `state` when needed); don’t add gratuitous context (`MacroAirForce_...` everywhere)

Consistent vocabulary beats cleverness. Cute or opaque puns age badly.
