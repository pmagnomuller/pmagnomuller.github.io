---
title: "Django Signals"
date: 2023-11-25
categories:
  - Django
  - Python
tags:
  - Django
  - Django Signals
  - Python
  - Web Development
  - Backend
  - Event-Driven Programming
toc: true
toc_sticky: false
---

# Django Signals
**What:** Observer pattern. Something happens (e.g. model save) → receivers run. Decouples “who did it” from “what runs after.”

- **Built-in model signals:** `pre_save`, `post_save`, `pre_delete`, `post_delete`, `m2m_changed`. Use `@receiver(post_save, sender=MyModel)`.
- **Custom signal:** `from django.dispatch import Signal` → `my_signal = Signal(providing_args=['order'])` → `my_signal.send(sender=self, order=...)`. Receivers connect with `@receiver(my_signal)`.
- **Register receivers:** In `AppConfig.ready()` do `import myapp.signals` so they’re loaded.

**Use for:** Creating a Profile when User is created, audit log on save/delete, cache invalidation, sending an email when Order is created. Keep handlers **light** — no heavy work; queue a Celery task if needed.

**Gotchas:** Recursion (e.g. post_save on User creates Profile, post_save on Profile updates User → infinite loop). Avoid saving the same model or the sender that triggered the signal inside the receiver. For tests: disconnect the receiver in setUp if you don’t want it, reconnect in tearDown.

**Bulk ops:** `bulk_create` / `update()` don’t fire model signals. Disconnect temporarily if you need to skip them, or run logic in a different path.
