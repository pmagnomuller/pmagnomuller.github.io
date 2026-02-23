---
title: "Django Email Testing"
date: 2023-11-28
categories:
  - Django
  - Python
  - Testing
tags:
  - Django
  - Email Testing
  - Python
  - Testing
  - Web Development
  - Backend
toc: true
toc_sticky: false
---

# Django Email Testing
**Idea:** In tests, Django can use an in-memory backend so nothing is really sent. All “sent” emails go to `mail.outbox` (a list).

- **Test settings:** `EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'` (or leave default in tests; many setups use locmem). Then `from django.core import mail` and assert on `mail.outbox`.
- **Assert:** `len(mail.outbox) == 1`, `mail.outbox[0].subject`, `mail.outbox[0].to`, `mail.outbox[0].body`. For HTML: `mail.outbox[0].alternatives`.
- **Views that send email:** Call the view (e.g. post to register), then assert outbox. No sleep — with locmem it’s synchronous.
- **Templates:** Render with `render_to_string('emails/welcome.html', context)` and assert content, or send and assert body/alternatives.
- **Celery tasks that send email:** Use `CELERY_ALWAYS_EAGER=True` in tests so the task runs inline, then check `mail.outbox`. Or mock `send_mail` and assert it was called with the right args.

**Avoid:** `time.sleep()` to “wait” for email. Use the right backend and/or EAGER so everything is immediate.

**Clear outbox between tests:** `mail.outbox` is usually cleared per test; if not, `mail.outbox.clear()` in setUp.
