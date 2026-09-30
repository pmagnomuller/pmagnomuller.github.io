---
title: "Clean Code Chapter 17: Smells and Heuristics"
chapter: 17
part: "Smells and Heuristics"
collection: cleancode
---

A practical catalog of smells and heuristics spanning the rest of the book — a checklist for reviews and refactors. Treat them as signals, not laws.

## Comments

- Inappropriate information, obsolete comments, redundant comments
- Poorly written comments; commented-out code (delete it)

## Environment / general

- Build requires more than one step; tests require more than one step
- Duplication (the book’s strongest general rule)
- Multiple languages jammed into one source file
- Too much information on an interface; clutter; vertical / horizontal opacity
- Feature envy; argument lists that wander; dead code
- Speculative generality; framework / convention without structure to enforce it
- Prefer polymorphism to sprawling `if`/`switch` when types vary
- Don’t inherit constants to cheat scoping; choose descriptive names and revisit them as meaning drifts
- Function names must say what they do (`add(5)` is opaque — days? mutate or copy?)

## Functions

- Too many arguments; output arguments; flag arguments (avoid — don’t add them)
- Dead functions; boolean entanglement; temporal coupling without names that reveal order

## Names / classes / tests

- Encoded or disinformative names; names at the wrong abstraction level
- Classes that are too big or have too many instance variables
- Tests that are unclear, incomplete, or unassertive

Prefer the smallest change that removes the smell. A name smell often hides a function or class smell. When in doubt: make the next reader faster.
