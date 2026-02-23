---
title: "Django Formsets"
date: 2023-11-30
categories:
  - Django
  - Python
tags:
  - Django
  - Django Formsets
  - Python
  - Web Development
  - Forms
  - Backend
toc: true
toc_sticky: false
---

# Django Formsets
**What:** Multiple instances of the same form on one page (e.g. many products in one order). Same form, N times, one submit.

- **formset_factory(Form, extra=2, max_num=10)** — plain forms, no model.
- **modelformset_factory(Model, fields=..., extra=..., can_delete=True)** — tied to model, can save/update/delete.
- **inlineformset_factory(Parent, Child, fields=...)** — for related objects (e.g. Order + OrderItems). Pass `instance=order` in the view.

**Template must have:** `{{ formset.management_form }}` (TOTAL_FORMS, INITIAL_FORMS, etc.). Without it, formset breaks.

**View pattern:**  
POST → `formset = FormSet(request.POST, request.FILES)` (and for inline: `instance=parent`).  
GET → `formset = FormSet()` or `FormSet(queryset=...)` for existing data.  
If valid: loop `for form in formset` and only save when `form.cleaned_data` (and not `form.cleaned_data.get('DELETE')` for model formsets with delete).

**Gotchas:**
- Check `form.cleaned_data` before saving — empty rows still appear in the formset.
- File uploads: pass `request.FILES` into the formset.
- Dynamic add/remove: update `id_form-TOTAL_FORMS` in the management form and renumber indices when adding rows in JS.

**Custom validation:** subclass `BaseFormSet`, override `clean()`, call `super().clean()`, then add your checks (e.g. at least one row, no duplicate names).

Use **model** formset when you’re editing DB rows; **inline** when editing parent + children together; **plain** formset when it’s just a bunch of forms not tied to one model.
