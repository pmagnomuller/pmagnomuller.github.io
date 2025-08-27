---
title: "Implementing Decentralized Git Hooks: A Team Approach"
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

# Implementing Decentralized Git Hooks: A Team Approach

## Introduction

Git hooks are powerful tools that can automate various tasks during the Git workflow. However, managing hooks across a team can be challenging when they're stored locally. In this post, I'll explore how to implement decentralized git hooks that can be shared and maintained across your development team.

## The Problem with Traditional Git Hooks

Traditional git hooks are stored in the `.git/hooks` directory, which means:
- They're not version controlled
- Each developer needs to set them up manually
- No consistency across team members
- Difficult to maintain and update

## Solution: Decentralized Git Hooks

### 1. Using Git Hooks Directory

Configure Git to use a custom hooks directory:

```bash
# Set up a custom hooks directory
git config core.hooksPath .githooks

# Create the directory
mkdir .githooks
```

### 2. Version Control Your Hooks

```bash
# Add hooks to version control
git add .githooks/
git commit -m "Add shared git hooks"
```

### 3. Example Hook Structure

```
.githooks/
├── pre-commit
├── commit-msg
├── pre-push
└── post-merge
```

## Common Hook Implementations

### Pre-commit Hook

```bash
#!/bin/bash
# .githooks/pre-commit

echo "Running pre-commit checks..."

# Run linting
if ! npm run lint; then
    echo "❌ Linting failed"
    exit 1
fi

# Run tests
if ! npm test; then
    echo "❌ Tests failed"
    exit 1
fi

# Check for TODO comments
if git diff --cached --name-only | xargs grep -l "TODO"; then
    echo "⚠️  Warning: TODO comments found in staged files"
fi

echo "✅ Pre-commit checks passed"
```

### Commit Message Hook

```bash
#!/bin/bash
# .githooks/commit-msg

# Check commit message format
commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
    echo "❌ Invalid commit message format"
    echo "Expected: type(scope): description"
    echo "Example: feat(auth): add user authentication"
    exit 1
fi

echo "✅ Commit message format is valid"
```

### Pre-push Hook

```bash
#!/bin/bash
# .githooks/pre-push

echo "Running pre-push checks..."

# Run full test suite
if ! npm run test:full; then
    echo "❌ Full test suite failed"
    exit 1
fi

# Check for sensitive data
if git diff --name-only | xargs grep -l "password\|secret\|api_key"; then
    echo "❌ Potential sensitive data detected"
    exit 1
fi

echo "✅ Pre-push checks passed"
```

## Team Setup Script

Create a setup script for new team members:

```bash
#!/bin/bash
# setup-hooks.sh

echo "Setting up git hooks..."

# Configure git to use custom hooks directory
git config core.hooksPath .githooks

# Make hooks executable
chmod +x .githooks/*

# Install dependencies if needed
if [ -f "package.json" ]; then
    npm install
fi

echo "✅ Git hooks setup complete"
```

## Advanced Hook Features

### 1. Conditional Execution

```bash
#!/bin/bash
# .githooks/pre-commit

# Only run expensive checks on changed files
changed_files=$(git diff --cached --name-only --diff-filter=ACM)

if echo "$changed_files" | grep -q "\.py$"; then
    echo "Running Python linting..."
    flake8 $(echo "$changed_files" | grep "\.py$")
fi

if echo "$changed_files" | grep -q "\.js$"; then
    echo "Running JavaScript linting..."
    eslint $(echo "$changed_files" | grep "\.js$")
fi
```

### 2. Hook Configuration

Create a configuration file for hooks:

```yaml
# .githooks/config.yaml
hooks:
  pre-commit:
    enabled: true
    checks:
      - lint
      - test
      - security
  commit-msg:
    enabled: true
    pattern: "^(feat|fix|docs|style|refactor|test|chore)(\\(.+\\))?: .+"
  pre-push:
    enabled: true
    checks:
      - full-test
      - security-scan
```

### 3. Hook Management Script

```bash
#!/bin/bash
# manage-hooks.sh

case "$1" in
    "install")
        git config core.hooksPath .githooks
        chmod +x .githooks/*
        echo "Hooks installed"
        ;;
    "disable")
        git config --unset core.hooksPath
        echo "Hooks disabled"
        ;;
    "status")
        hooks_path=$(git config core.hooksPath)
        if [ -z "$hooks_path" ]; then
            echo "Hooks: disabled"
        else
            echo "Hooks: enabled ($hooks_path)"
        fi
        ;;
    *)
        echo "Usage: $0 {install|disable|status}"
        exit 1
        ;;
esac
```

## Best Practices

### 1. Keep Hooks Fast

```bash
#!/bin/bash
# Only run checks on changed files
changed_files=$(git diff --cached --name-only)

# Skip if no relevant files changed
if ! echo "$changed_files" | grep -q "\.py$"; then
    exit 0
fi

# Run only necessary checks
flake8 $(echo "$changed_files" | grep "\.py$")
```

### 2. Provide Clear Error Messages

```bash
#!/bin/bash
if ! command -v flake8 &> /dev/null; then
    echo "❌ flake8 is not installed"
    echo "Install it with: pip install flake8"
    exit 1
fi
```

### 3. Allow Bypass for Emergencies

```bash
#!/bin/bash
# Allow bypass with --no-verify
if [ "$SKIP_HOOKS" = "true" ]; then
    echo "⚠️  Hooks skipped"
    exit 0
fi
```

## Integration with CI/CD

### GitHub Actions Integration

```yaml
# .github/workflows/hooks.yml
name: Verify Hooks
on: [push, pull_request]

jobs:
  verify-hooks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Run pre-commit checks
        run: |
          chmod +x .githooks/*
          .githooks/pre-commit
```

## Troubleshooting

### Common Issues

1. **Hooks not running**: Check if `core.hooksPath` is set correctly
2. **Permission denied**: Ensure hooks are executable (`chmod +x`)
3. **Hooks too slow**: Optimize by only checking changed files
4. **Team members not using hooks**: Provide clear setup instructions

### Debug Mode

```bash
#!/bin/bash
# Add to any hook for debugging
if [ "$DEBUG_HOOKS" = "true" ]; then
    set -x
fi
```

## Conclusion

Decentralized git hooks provide a powerful way to maintain code quality and consistency across your development team. By version controlling your hooks and providing clear setup instructions, you can ensure everyone follows the same standards and processes.

---

*Remember to keep hooks fast, provide clear error messages, and make them easy to bypass when necessary.*
