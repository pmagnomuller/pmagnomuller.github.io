---
title: "Git Cheat Sheet: The Complete Guide for Developers"
date: 2023-12-10
categories:
  - Git
tags:
  - Git
  - Version Control
  - Git Commands
  - Software Development
  - Cheat Sheet
toc: true
toc_sticky: false
---

# Git Cheat Sheet: The Complete Guide for Developers

**Published:** December 15, 2022

## Introduction

Git is the most popular version control system in the world, used by millions of developers daily. Whether you're a beginner or an experienced developer, having a quick reference for Git commands is invaluable. This comprehensive cheat sheet covers everything from basic operations to advanced techniques that will make you more productive.

## Getting Started

### Repository Setup

```bash
# Initialize a new repository
git init

# Clone an existing repository
git clone <repository-url>
git clone <repository-url> <directory-name>

# Clone a specific branch
git clone -b <branch-name> <repository-url>

# Clone with limited history (faster for large repos)
git clone --depth 1 <repository-url>
```

### Basic Configuration

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim

# View your configuration
git config --list
git config --global --list
```

## Daily Workflow

### Checking Status and History

```bash
# Check repository status
git status
git status --short  # Compact view

# View commit history
git log
git log --oneline    # One line per commit
git log --graph      # Show branch structure
git log -p           # Show changes in each commit
git log --author="name"  # Filter by author
git log --since="2023-01-01"  # Filter by date

# Show specific commit
git show <commit-hash>
git show HEAD        # Latest commit
```

### Making Changes

```bash
# Stage files for commit
git add <filename>           # Add specific file
git add .                    # Add all files
git add *.js                 # Add all JavaScript files
git add -p <filename>        # Interactive staging

# Unstage files
git reset HEAD <filename>    # Unstage specific file
git reset HEAD               # Unstage all files

# Commit changes
git commit -m "Your commit message"
git commit -am "Message"     # Add and commit tracked files
git commit --amend           # Modify last commit

# Remove files
git rm <filename>            # Remove and stage deletion
git rm --cached <filename>   # Remove from tracking but keep file
```

### Working with Branches

```bash
# List branches
git branch                   # Local branches
git branch -r                # Remote branches
git branch -a                # All branches

# Create and switch branches
git branch <branch-name>     # Create branch
git checkout <branch-name>   # Switch to branch
git checkout -b <branch-name>  # Create and switch
git switch <branch-name>     # Modern way to switch (Git 2.23+)
git switch -c <branch-name>  # Create and switch (modern)

# Delete branches
git branch -d <branch-name>  # Delete (safe)
git branch -D <branch-name>  # Force delete

# Rename current branch
git branch -m <new-name>
```

### Merging and Rebasing

```bash
# Merge branches
git merge <branch-name>      # Merge into current branch
git merge --no-ff <branch-name>  # Force merge commit

# Abort merge
git merge --abort

# Rebase (cleaner history)
git rebase <branch-name>     # Rebase current branch onto target
git rebase -i HEAD~3         # Interactive rebase (last 3 commits)
git rebase --abort           # Abort rebase

# Cherry-pick specific commits
git cherry-pick <commit-hash>
```

## Remote Operations

### Working with Remotes

```bash
# Add remote repository
git remote add origin <repository-url>
git remote add upstream <repository-url>

# List remotes
git remote -v

# Remove remote
git remote remove <remote-name>

# Fetch changes
git fetch origin             # Fetch from origin
git fetch --all              # Fetch from all remotes

# Pull changes
git pull origin main         # Pull and merge
git pull --rebase origin main  # Pull and rebase

# Push changes
git push origin main         # Push to remote
git push -u origin main      # Set upstream and push
git push --force-with-lease  # Safe force push
git push --delete origin <branch-name>  # Delete remote branch
```

### Collaboration

```bash
# Create pull request (GitHub/GitLab)
# 1. Push your branch
git push origin feature-branch

# 2. Go to GitHub/GitLab and create PR

# Review changes
git diff origin/main...HEAD  # Changes in your branch
git diff HEAD~1              # Changes in last commit
```

## Advanced Operations

### Stashing

```bash
# Save work in progress
git stash                    # Stash current changes
git stash push -m "message"  # Stash with message
git stash list               # List stashes
git stash pop                # Apply and remove latest stash
git stash apply stash@{0}    # Apply specific stash
git stash drop stash@{0}     # Remove specific stash
git stash clear              # Remove all stashes
```

### Resetting and Reverting

```bash
# Reset commits
git reset --soft HEAD~1      # Undo commit, keep changes staged
git reset --mixed HEAD~1     # Undo commit, unstage changes
git reset --hard HEAD~1      # Undo commit, discard changes

# Revert commits (safer for shared history)
git revert <commit-hash>     # Create new commit that undoes changes
git revert HEAD              # Revert last commit

# Reset to specific commit
git reset --hard <commit-hash>
```

### Tags

```bash
# Create tags
git tag v1.0.0               # Lightweight tag
git tag -a v1.0.0 -m "Release 1.0.0"  # Annotated tag

# List tags
git tag
git tag -l "v1.*"            # Filter tags

# Push tags
git push origin v1.0.0       # Push specific tag
git push origin --tags       # Push all tags

# Delete tags
git tag -d v1.0.0            # Delete local tag
git push origin --delete v1.0.0  # Delete remote tag
```

### Submodules

```bash
# Add submodule
git submodule add <repository-url> <path>

# Initialize submodules
git submodule init
git submodule update

# Clone repository with submodules
git clone --recursive <repository-url>

# Update submodules
git submodule update --remote
```

## Useful Aliases

### Set up these aliases for productivity

```bash
# Add to your ~/.gitconfig or run these commands:

# Status shortcuts
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# Log shortcuts
git config --global alias.lg "log --oneline --graph --decorate"
git config --global alias.lga "log --oneline --graph --decorate --all"

# Diff shortcuts
git config --global alias.diffstat "diff --stat"
git config --global alias.dc "diff --cached"

# Branch shortcuts
git config --global alias.new "checkout -b"
git config --global alias.delete "branch -d"

# Stash shortcuts
git config --global alias.sa "stash apply"
git config --global alias.sl "stash list"
```

## Common Workflows

### Feature Branch Workflow

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "Add new feature"

# Push feature branch
git push -u origin feature/new-feature

# Create pull request on GitHub/GitLab
# After PR is merged, clean up locally
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### Hotfix Workflow

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix the bug
git add .
git commit -m "Fix critical bug"

# Push and create PR
git push -u origin hotfix/critical-bug

# After merge, tag the release
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix release"
git push origin v1.0.1
```

### Cleanup Workflow

```bash
# Clean up merged branches
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# Clean up remote tracking branches
git remote prune origin

# Clean up old tags
git tag -l | xargs git tag -d
git fetch --tags
```

## Troubleshooting

### Common Issues and Solutions

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Fix commit message
git commit --amend

# Recover deleted branch
git reflog
git checkout -b <branch-name> <commit-hash>

# Fix merge conflicts
# 1. Edit conflicted files
# 2. Add resolved files
git add <resolved-files>
# 3. Complete merge
git commit

# Reset to remote state
git fetch origin
git reset --hard origin/main

# Clean untracked files
git clean -n  # Preview what will be deleted
git clean -f  # Force delete untracked files
git clean -fd # Delete untracked files and directories
```

### Debugging

```bash
# See what changed in a file
git blame <filename>

# Find when a line was added/removed
git log -S "search term" <filename>

# Show file history
git log --follow <filename>

# Find commits by message
git log --grep="search term"

# Show commit statistics
git log --stat
git log --shortstat
```

## Best Practices

### Commit Messages

```bash
# Good commit message format:
git commit -m "feat: add user authentication system

- Implement JWT token authentication
- Add login/logout endpoints
- Include password hashing with bcrypt
- Add user registration form

Closes #123"
```

### Branch Naming

```bash
# Use descriptive branch names:
feature/user-authentication
bugfix/login-error
hotfix/security-patch
release/v1.2.0
```

### Git Ignore

```bash
# Common .gitignore entries:
*.log
node_modules/
.env
.DS_Store
*.pyc
__pycache__/
.vscode/
.idea/
```

## Quick Reference

### Most Used Commands

```bash
# Daily workflow
git status              # Check status
git add .               # Stage changes
git commit -m "msg"     # Commit changes
git push                # Push to remote
git pull                # Pull from remote

# Branching
git checkout -b feature # Create and switch to branch
git checkout main       # Switch to main
git merge feature       # Merge feature into current branch

# History
git log --oneline       # View commits
git show HEAD           # Show last commit
git diff                # Show unstaged changes
```

### Emergency Commands

```bash
# Undo everything
git reset --hard HEAD
git clean -fd

# Go back to remote state
git fetch origin
git reset --hard origin/main

# Abort operations
git merge --abort
git rebase --abort
git cherry-pick --abort
```

## Conclusion

This Git cheat sheet covers the most important commands and workflows you'll use daily. Remember:

1. **Practice regularly** - Git becomes second nature with use
2. **Use meaningful commit messages** - Your future self will thank you
3. **Create feature branches** - Keep your main branch clean
4. **Pull before pushing** - Avoid merge conflicts
5. **Use aliases** - Speed up your workflow

The key to mastering Git is understanding that it's a tool for tracking changes and collaborating with others. Start with the basic commands and gradually incorporate more advanced features as you become comfortable.

---

*Git is powerful, but it doesn't have to be complicated. With these commands and workflows, you'll be able to handle most Git operations confidently and efficiently.*
