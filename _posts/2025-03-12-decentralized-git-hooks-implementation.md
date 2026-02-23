---
title: "Decentralized Git Hooks"
date: 2025-03-12
categories:
  - Git
  - DevOps
tags:
  - Git
  - Git Hooks
  - DevOps
  - Version Control
  - Automation
  - Team Development
toc: true
toc_sticky: false
---

# Decentralized Git Hooks
**Why:** `.git/hooks` isn’t versioned → everyone sets up by hand → inconsistent. Fix: shared hooks in repo.

- **Use a custom hooks dir:** `git config core.hooksPath .githooks` → put scripts in `.githooks/`, commit them.
- **Make executable:** `chmod +x .githooks/*`
- **New devs:** one-time `git config core.hooksPath .githooks` (or a small `setup-hooks.sh` that does that + chmod).

**Useful hooks I keep:**
- **pre-commit:** lint + tests on staged files. Fail fast so bad code doesn’t get committed.
- **commit-msg:** enforce format (e.g. `type(scope): message`). Reject otherwise.
- **pre-push:** full test suite, maybe secrets scan. Heavier checks before push.

**Tips:**
- Keep hooks **fast** — only run on changed files when possible.
- Clear errors: tell people what failed and how to fix (e.g. “install flake8: pip install flake8”).
- Allow bypass when needed: respect `--no-verify` or a `SKIP_HOOKS=true` env for emergencies.
- Optional: `manage-hooks.sh` with `install` / `disable` / `status` so people can turn hooks off if needed.

**Conditional checks:** in pre-commit, get `git diff --cached --name-only` and only run Python lint if `.py` files changed, JS lint if `.js` changed, etc.

**CI:** Run the same checks in CI (e.g. call `.githooks/pre-commit`) so the pipeline matches local.

**If hooks don’t run:** check `git config core.hooksPath` and that files are executable (`chmod +x`).
