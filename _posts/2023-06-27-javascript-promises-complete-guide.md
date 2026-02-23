---
title: "JS Promises: Promise.all vs Promise.allSettled"
date: 2023-06-27
categories:
  - JavaScript
tags:
  - JavaScript
  - Promises
  - Asynchronous Programming
  - Promise.all
  - Promise.allSettled
  - Async/Await
toc: true
toc_sticky: false
---

# JS Promises: Promise.all vs Promise.allSettled
**Promise.all(iterable)**
- Resolves when **all** resolve; **rejects as soon as one** rejects (fail-fast).
- Result: array of **values** in same order.
- Use when: you need every call to succeed (e.g. load user + posts + settings for one screen).

**Promise.allSettled(iterable)**
- **Always** resolves after all finish. Never rejects.
- Result: array of `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.
- Use when: partial failure is OK (e.g. batch uploads, validation across many fields — you want to know which failed).

**Quick pick:**
- All must succeed, order matters → `Promise.all`.
- Want to see who succeeded/failed → `Promise.allSettled`, then filter by `status`.

**Async/await:**  
`const results = await Promise.all([...])` or `await Promise.allSettled([...])`. For `all`, wrap in try/catch for the first rejection.

**Older runtimes:** `Promise.allSettled` needs a polyfill or Node 12.9+ / modern browsers.
