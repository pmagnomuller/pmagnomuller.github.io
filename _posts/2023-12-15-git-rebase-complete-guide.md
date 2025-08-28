---
title: "Git Rebase: A Complete Guide to Keeping Your Branch Up-to-Date"
date: 2023-03-10
toc_sticky: false
---




Git rebase is one of the most powerful and useful Git operations for maintaining a clean, linear project history. Unlike merging, which creates a merge commit, rebasing allows you to replay your commits on top of another branch, creating a cleaner and more readable commit history. In this comprehensive guide, I'll walk you through everything you need to know about Git rebase, from basic concepts to advanced techniques.

## What is Git Rebase?

Git rebase is a command that allows you to move or combine a sequence of commits to a new base commit. Think of it as "replaying" your commits on top of a different starting point. This is particularly useful for keeping your feature branches up-to-date with the latest changes from the main branch.

### Why Use Rebase?

1. **Cleaner History**: Creates a linear commit history without merge commits
2. **Easier to Read**: Makes it easier to understand the project's evolution
3. **Better for Code Review**: Each commit represents a logical change
4. **Easier to Debug**: Linear history makes it easier to find when bugs were introduced

## Basic Rebase Operations

### Step 1: Checkout the Branch You Want to Rebase

```bash
# Switch to the branch you want to rebase
git checkout feature-branch

# Or use the modern git switch command
git switch feature-branch
```

### Step 2: Fetch the Latest Changes

```bash
# Fetch the latest changes from the remote repository
git fetch origin

# Or fetch from all remotes
git fetch --all
```

### Step 3: Rebase Your Branch

```bash
# Rebase your branch onto the main branch
git rebase main

# Or rebase onto a specific branch
git rebase develop

# Rebase onto a remote branch
git rebase origin/main
```

### Step 4: Resolve Conflicts (if necessary)

During the rebase process, Git may encounter conflicts that need to be resolved manually.

```bash
# If conflicts occur, Git will pause the rebase
# Edit the conflicted files to resolve conflicts
# Then stage the resolved files
git add <resolved-files>

# Continue the rebase process
git rebase --continue

# Or if you want to abort the rebase
git rebase --abort
```

### Step 5: Push the Rebased Branch

```bash
# Push the rebased branch to remote
git push origin feature-branch

# If the branch was already pushed before, you'll need to force push
git push --force-with-lease origin feature-branch
```

## Complete Rebase Workflow Example

Let's walk through a complete example of rebasing a feature branch:

```bash
# 1. Start on your feature branch
git checkout feature-branch

# 2. Fetch latest changes
git fetch origin

# 3. Rebase onto main
git rebase origin/main

# 4. If conflicts occur, resolve them and continue
# Edit conflicted files
git add resolved-file.txt
git rebase --continue

# 5. Push the rebased branch
git push --force-with-lease origin feature-branch
```

## Interactive Rebase

Interactive rebase is a powerful feature that allows you to modify commits during the rebase process.

### Starting an Interactive Rebase

```bash
# Interactive rebase of the last 3 commits
git rebase -i HEAD~3

# Interactive rebase from a specific commit
git rebase -i <commit-hash>

# Interactive rebase onto main
git rebase -i main
```

### Interactive Rebase Commands

When you start an interactive rebase, Git opens an editor with a list of commits and available commands:

```bash
# Available commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
```

### Example Interactive Rebase

```bash
# Start interactive rebase
git rebase -i HEAD~3

# This opens an editor with something like:
pick abc1234 First commit message
pick def5678 Second commit message
pick ghi9012 Third commit message

# You can modify it to:
pick abc1234 First commit message
squash def5678 Second commit message
reword ghi9012 Third commit message
```

## Advanced Rebase Techniques

### Rebase with Merge Strategy

```bash
# Rebase and automatically resolve conflicts using merge strategy
git rebase --strategy=recursive --strategy-option=theirs main

# Rebase with specific merge strategy
git rebase --strategy=ours main
```

### Rebase Onto a Different Base

```bash
# Rebase onto a different branch than the current branch's upstream
git rebase --onto new-base old-base feature-branch

# Example: Rebase commits from feature-branch onto main
git rebase --onto main develop feature-branch
```

### Rebase with Preserved Merge Commits

```bash
# Preserve merge commits during rebase
git rebase --preserve-merges main

# Or use the newer --rebase-merges option
git rebase --rebase-merges main
```

## Handling Conflicts During Rebase

### Understanding Rebase Conflicts

When conflicts occur during a rebase, Git will:

1. **Pause the rebase** at the conflicting commit
2. **Show you which files have conflicts**
3. **Wait for you to resolve conflicts**
4. **Continue when you're ready**

### Resolving Conflicts Step by Step

```bash
# 1. Check which files have conflicts
git status

# 2. Open conflicted files and resolve conflicts
# Look for conflict markers: <<<<<<<, =======, >>>>>>>

# 3. After resolving conflicts, stage the files
git add resolved-file.txt

# 4. Continue the rebase
git rebase --continue

# 5. If you want to abort the rebase
git rebase --abort
```

### Using Merge Tools for Conflict Resolution

```bash
# Use a visual merge tool
git mergetool

# Use a specific merge tool
git mergetool --tool=vimdiff

# Configure your preferred merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

## Best Practices for Rebase

### 1. **Never Rebase Public Branches**

```bash
# ❌ DON'T do this on shared branches
git rebase main  # If main is shared with others

# ✅ DO rebase your feature branches
git rebase main  # On your personal feature branch
```

### 2. **Use Force Push Safely**

```bash
# Use --force-with-lease instead of --force
git push --force-with-lease origin feature-branch

# This prevents overwriting others' work
```

### 3. **Rebase Frequently**

```bash
# Rebase your feature branch regularly
git fetch origin
git rebase origin/main

# This keeps conflicts small and manageable
```

### 4. **Use Interactive Rebase for Clean History**

```bash
# Clean up your commits before merging
git rebase -i main

# Squash related commits together
# Reword commit messages for clarity
```

## Common Rebase Scenarios

### Scenario 1: Updating Feature Branch

```bash
# You're working on a feature branch and main has new commits
git checkout feature-branch
git fetch origin
git rebase origin/main

# Resolve any conflicts
git push --force-with-lease origin feature-branch
```

### Scenario 2: Cleaning Up Commit History

```bash
# Clean up the last 5 commits
git rebase -i HEAD~5

# In the editor:
# - Pick the commits you want to keep
# - Squash related commits together
# - Reword commit messages
# - Drop unnecessary commits
```

### Scenario 3: Moving Commits to a Different Branch

```bash
# Move commits from feature-branch to a new branch
git checkout -b new-feature-branch
git rebase --onto main old-base feature-branch
```

### Scenario 4: Rebase After Pull Request Review

```bash
# After getting feedback on a pull request
git checkout feature-branch
git rebase -i main

# Make the requested changes
# Squash fix commits into the original commits
git push --force-with-lease origin feature-branch
```

## Troubleshooting Rebase Issues

### Problem 1: Rebase Conflicts

```bash
# If you get stuck during a rebase
git status  # See what's happening
git rebase --abort  # Start over
git rebase --skip  # Skip the current commit
```

### Problem 2: Lost Commits After Rebase

```bash
# Find lost commits
git reflog

# Recover lost commits
git checkout -b recovery-branch <commit-hash>
```

### Problem 3: Force Push Rejected

```bash
# Someone else pushed to your branch
git fetch origin
git rebase origin/feature-branch
git push --force-with-lease origin feature-branch
```

### Problem 4: Rebase Loop

```bash
# If you're stuck in a rebase loop
git rebase --abort
git reset --hard origin/feature-branch
# Start fresh
```

## Rebase vs Merge

### When to Use Rebase

```bash
# ✅ Use rebase for:
# - Feature branches
# - Personal branches
# - Cleaning up commit history
# - Keeping branches up-to-date
```

### When to Use Merge

```bash
# ✅ Use merge for:
# - Public/shared branches
# - Preserving complete history
# - Merging feature branches into main
```

### Comparison Example

```bash
# Rebase approach (clean history)
git checkout feature-branch
git rebase main
git checkout main
git merge feature-branch

# Merge approach (preserves history)
git checkout main
git merge feature-branch
```

## Advanced Rebase Commands

### Rebase with Commits Filtering

```bash
# Rebase only commits that match a pattern
git rebase --onto main --root feature-branch

# Rebase with commit filtering
git rebase -i --root feature-branch
```

### Rebase with External Commands

```bash
# Run a command after each commit during rebase
git rebase -x "npm test" main

# This runs tests after each commit is applied
```

### Rebase with Preserved Author Information

```bash
# Preserve original author information
git rebase --preserve-author main
```

## Git Rebase in Team Workflows

### Team Guidelines

1. **Communicate Before Rebase**: Let your team know if you're rebasing a shared branch
2. **Use Feature Branches**: Keep rebasing to personal feature branches
3. **Rebase Before Merging**: Always rebase your feature branch before creating a pull request
4. **Use Pull Requests**: Use pull requests for code review before merging

### Workflow Example

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make commits
git add .
git commit -m "Add new feature"

# 3. Keep branch updated
git fetch origin
git rebase origin/main

# 4. Clean up commits before PR
git rebase -i main

# 5. Push and create pull request
git push --force-with-lease origin feature/new-feature
```

## Conclusion

Git rebase is a powerful tool that helps maintain a clean, linear commit history. While it can be intimidating at first, understanding when and how to use rebase will make you a more effective Git user.

**Key Takeaways:**

1. **Use rebase for feature branches** to keep them up-to-date with main
2. **Never rebase public/shared branches** to avoid disrupting others' work
3. **Use interactive rebase** to clean up your commit history
4. **Resolve conflicts carefully** during rebase operations
5. **Use `--force-with-lease`** instead of `--force` for safer pushing

**Remember**: Rebase is a tool for maintaining clean history, but it's not always the right choice. Use merge when you want to preserve the complete history of how features were developed.

---

*Git rebase is an essential skill for any developer working with Git. With practice and understanding, it becomes a powerful tool for maintaining clean, readable commit histories.*
