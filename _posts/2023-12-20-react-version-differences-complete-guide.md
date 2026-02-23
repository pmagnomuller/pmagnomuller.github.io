---
title: "React Version Differences"
date: 2023-12-20
categories:
  - React
  - JavaScript
tags:
  - React
  - JavaScript
  - Frontend
  - Web Development
  - React Hooks
  - React 18
toc: true
toc_sticky: false
---

# React Version Differences
**Quick timeline:** 16 (Fiber, Error Boundaries, Portals) → 16.8 (Hooks) → 17 (new JSX transform, no React import for JSX; event delegation at root) → 18 (createRoot, automatic batching, Suspense, startTransition).

**React 16:** Error boundaries (class component with getDerivedStateFromError + componentDidCatch). Portals: `ReactDOM.createPortal(jsx, domNode)`. Fragments `<>...</>`.

**React 16.8 — Hooks:** useState, useEffect, useContext, etc. Dependency array in useEffect; cleanup function returned from useEffect. No more class for state/lifecycle in new code.

**React 17:** Can omit `import React from 'react'` when using JSX (new transform). Events no longer pooled — `e.persist()` not needed. Event delegation on root container, not document (helps multiple React roots).

**React 18:** `ReactDOM.createRoot(domNode).render(<App />)` instead of `ReactDOM.render`. Automatic batching (setState in timeouts/promises batched too). startTransition for non-urgent updates. Strict Mode double-invokes effects in dev. Suspense for data (with compatible libs).

**Upgrade 17→18:** Switch to createRoot; check for any reliance on legacy render or batching behavior. Remove any remaining event.persist().

**When in doubt:** Check React docs for the version you’re on; Hooks and createRoot are the two biggest mental shifts.
