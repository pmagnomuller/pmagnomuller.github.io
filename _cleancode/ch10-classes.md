---
title: "Clean Code Chapter 10: Classes"
chapter: 10
part: "Principles"
collection: cleancode
---

Classes should be small and focused on a single responsibility (SRP): one reason to change.

## Organization

Typical order: statics → instance variables → public functions → private utilities used by those publics. Prefer keeping encapsulation; loosen it only as a last resort.

## Size and SRP

- Smaller is the primary rule, measured by responsibilities more than line count
- A class name should describe its responsibility; if you need “and/or/if/but” to describe it in ~25 words, it’s too big
- God classes with dozens of methods are a smell even when each method looks fine alone
- High cohesion: methods use the fields they share; few instance variables
- Maintaining cohesion often means *more* small classes, not fewer large ones
- Organize for change: isolate what varies; prefer open for extension where it earns its keep

Getting to green first is fine. Then refactor toward SRP and clear boundaries before the class grows roots everywhere.
