---
title: "Django FBV vs CBV — When to Use Which"
date: 2023-11-18
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
  - Code Examples
toc: true
toc_sticky: false
---

# Django FBV vs CBV — When to Use Which

Short cheat sheet so I don’t forget.

**Use FBV when:**
- View is simple (e.g. about, contact).
- One-off or custom flow (dashboard, report, webhook).
- You want everything visible in one function.
- Prototyping quickly.

**Use CBV when:**
- Standard list/detail/create/update/delete.
- Several views share the same mixins or base class.
- You want less boilerplate and consistent patterns.

**Useful CBV mixins:** `LoginRequiredMixin`, `UserPassesTestMixin` (override `test_func`), `SuccessMessageMixin`.  
**Override points:** `get_queryset`, `get_context_data`, `form_valid`, `get_success_url`.

**Hybrid:** e.g. list/detail as CBV, create/update as FBV if the flow is weird. Totally fine.
