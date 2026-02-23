---
title: "Python DateTime & Timezone"
date: 2023-09-15
categories:
  - Python
tags:
  - Python
  - DateTime
  - Timezone
  - Date Handling
  - Programming
toc: true
toc_sticky: false
---

# Python DateTime & Timezone
**Rule of thumb:** Store and compute in UTC. Convert to local only for display.

- **Naive vs aware:** `datetime.now()` is naive (no tz). Prefer `datetime.now(timezone.utc)` or `datetime.now(ZoneInfo("Europe/Lisbon"))`.
- **Python 3.9+:** `from zoneinfo import ZoneInfo` (stdlib). Older: use `pytz`.
- **pytz:** use `tz.localize(dt)` for local times; don’t pass tz into `datetime(..., tzinfo=pytz.timezone(...))` for non-UTC (DST issues).
- **Store in DB:** always in UTC. Validate `dt.tzinfo is not None` before save; convert with `dt.astimezone(timezone.utc)`.
- **DST:** ambiguous or non-existent times (e.g. 2:30 when clocks jump). pytz: `AmbiguousTimeError` / `NonExistentTimeError`. Handle explicitly (e.g. `is_dst=False` for ambiguous).
- **Testing:** patch `django.utils.timezone.now` or equivalent to fix “now” and assert on conversions.

**Debug:** log or print `dt`, `dt.tzinfo`, and `dt.astimezone(timezone.utc)` so you see what’s actually there.
