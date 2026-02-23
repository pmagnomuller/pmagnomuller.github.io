---
title: "Deploy Django to Railway"
date: 2022-11-17
categories:
  - Django
  - Python
  - Deployment
tags:
  - Django
  - Railway
  - Deployment
  - Python
  - Web Development
  - DevOps
toc: true
toc_sticky: false
---

# Deploy Django to Railway
**Prep:** `requirements.txt`, `Procfile`, env-based settings, static files handled (e.g. Whitenoise).

- **Procfile:** `web: gunicorn myproject.wsgi:application --bind 0.0.0.0:$PORT`
- **Settings:** `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, DB from env. Use `os.getenv()`. For DB: PostgreSQL vars from Railway when you add a Postgres service.
- **Static:** `STATIC_ROOT`, Whitenoise middleware, run `collectstatic` in build or release step.
- **Railway:** Connect repo → add Postgres if needed → set env vars (including ones Railway gives you for DB) → deploy. They detect Python and build.

**Env vars I set:** `DEBUG=False`, `SECRET_KEY`, `ALLOWED_HOSTS` (e.g. `.railway.app`), plus DB vars if not auto-injected.

**After deploy:** Run migrations (Railway CLI or dashboard shell). Create superuser if needed. Check logs for 500s.

**Gotchas:** Static 404 → ensure collectstatic ran and Whitenoise is in middleware. DB connection → confirm env vars and that the DB service is linked. Restart after changing env vars.

**Optional:** health check endpoint (`/health/` → 200), custom domain in Railway settings, Redis for cache if needed.
