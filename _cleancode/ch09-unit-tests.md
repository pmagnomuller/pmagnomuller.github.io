---
title: "Clean Code Chapter 9: Unit Tests"
chapter: 9
part: "Principles"
collection: cleancode
---

Tests are what keep clean code clean under change. Without them, every cleanup is a risk. Test code is not second-class — dirty tests rot and get deleted, then production code freezes.

## Three laws of TDD

1. No production code until you have a failing unit test
2. Write only enough test to fail (not compiling counts as failing)
3. Write only enough production code to pass that failing test

Cycle: fail → pass → refactor. Keep both sides clean.

## FIRST

- **Fast** — slow tests don’t get run
- **Independent** — order and shared state shouldn’t matter
- **Repeatable** — any environment, same result
- **Self-validating** — pass/fail without manual inspection
- **Timely** — written close to the production code (ideally first)

## Craft

- Readability is the top virtue in tests: clarity, simplicity, density of expression
- Build domain-specific helpers so tests read as arrange / act / assert, not API noise
- One assert per concept; one concept per test
- Coverage is a lagging indicator; confidence to change is the goal
