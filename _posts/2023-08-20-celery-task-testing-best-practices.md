---
title: "Celery Task Testing"
date: 2023-08-20
categories:
  - Python
  - Testing
tags:
  - Celery
  - Testing
  - Python
  - Task Queue
  - Best Practices
toc: true
toc_sticky: false
---

# Celery Task Testing
**Goal:** Test task logic without a real broker and without flakiness.

- **CELERY_ALWAYS_EAGER = True** (in test settings): tasks run inline when you call `.delay()`. No worker needed. Use with `CELERY_EAGER_PROPAGATES_EXCEPTIONS = True` so exceptions surface.
- **Mock external deps:** API calls, email, storage — patch them so tests don’t hit the network and are deterministic.
- **Unit test the task:** call `my_task.delay(args)` then `result.get()` and assert on return value and side effects (e.g. DB state).
- **Test failures too:** mock that raises, assert task fails or retries as expected.
- **Chains/groups:** use `.apply()` in tests to run synchronously and assert on the result.

**Pattern:** Set EAGER in setUp or test settings, patch `myapp.tasks.external_api` (or wherever the task imports it from), then run the task and assert. Keep tests fast and isolated.
