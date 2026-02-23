---
title: "Dependency Injection"
date: 2023-10-15
categories:
  - Software Design
  - Programming
tags:
  - Dependency Injection
  - Design Patterns
  - Software Architecture
  - Clean Code
  - SOLID Principles
toc: true
toc_sticky: false
---

# Dependency Injection
**Idea:** Don’t create dependencies inside a class; pass them in (constructor, param, or setter). Caller or a container provides the concrete implementation.

**Why:** Testable (inject mocks), swappable (different impl per env), loose coupling, single responsibility.

- **Constructor injection:** most common. Dependencies in the constructor; class doesn’t know concrete types if you use interfaces/abstracts.
- **Interfaces:** depend on `IUserRepository`, not `PostgresUserRepository`. Tests inject a fake.
- **Containers:** NestJS, Spring, Inversify, etc. Register “interface → implementation”, resolve at runtime. Use for big apps; avoid for tiny scripts.

**Good:** Inject all deps; keep constructors simple (no heavy logic). Prefer constructor over property/setter injection so required deps are obvious.

**Anti-patterns:** Service locator (class pulls from a global “get me X”), hidden singletons inside the class, circular deps (A → B → A).

**When to use:** Non-trivial app, need tests with mocks, multiple implementations. Skip for one-off scripts.
