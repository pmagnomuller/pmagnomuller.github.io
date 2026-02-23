---
title: "Django FBV vs CBV"
date: 2022-11-22
categories:
  - Django
  - Python
tags:
  - Django
  - Function-Based Views
  - Class-Based Views
  - Python
  - Web Development
  - Backend
toc: true
toc_sticky: false
---

# Django FBV vs CBV
**Reality:** Both can do the same job. Choice = team + use case, not religion.

**FBV (function-based):**
- Plain function `(request) → response`. Explicit, easy to read and debug.
- Good for: one-off views, simple pages, custom logic that doesn’t fit a CRUD pattern, quick prototypes.
- Downside: repetition (auth, get object, form handling) unless you factor into helpers/decorators.

**CBV (class-based):**
- `ListView`, `DetailView`, `CreateView`, `UpdateView`, `DeleteView` etc. Less code for standard CRUD.
- Good for: list/detail/create/update/delete that match Django’s expectations. Shared behavior via mixins (e.g. `LoginRequiredMixin`, `UserPassesTestMixin`).
- Downside: “magic” in the inheritance chain; need to know method order (`get_queryset`, `form_valid`, etc.).

**When I use which:**
- Standard CRUD → CBV.
- Oddball view, API endpoint, or heavy custom logic → FBV.
- Hybrid is fine: CBV for boring CRUD, FBV for the weird stuff.

**Testing:** Both are testable. FBV: call the function with a request. CBV: use the test client and reverse the URL.

Don’t overthink it — pick one per view and stay consistent in the project.
