---
title: "Clean Code Chapter 3: Functions"
chapter: 3
part: "Principles"
collection: cleancode
---

Functions should be small, do one thing, and stay at one level of abstraction.

## Shape

- Prefer short functions; extract until each tells a clear story
- Blocks inside `if` / `else` / `while` should usually be one line that names the intent (often a function call)
- Indent depth of one or two is a smell signal for extraction
- One level of abstraction per function — don’t mix orchestration with low-level detail
- Stepdown rule: code reads top-down like a narrative — *to do X, we do Y, then Z*
- Switch / large `if` chains: bury once at a low level (often a factory) and prefer polymorphism elsewhere
- Prefer few arguments; zero is ideal, three is usually a stretch
- Group related args into an object (`Point` instead of `x, y`)
- Flag arguments usually mean two functions
- Avoid output arguments and hidden side effects
- Command/query separation: change state *or* return info, not both in one call
- Prefer exceptions over error codes so the happy path stays linear
- DRY: duplication is often a missing abstraction

A function that “does one thing” cannot be usefully split further and still names a coherent unit of work. First drafts can be long; extract, rename, and restructure until the story is clear.
