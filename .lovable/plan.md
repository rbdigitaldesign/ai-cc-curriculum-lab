

# Add .env to .gitignore

A simple one-file change to prevent the `.env` file from being tracked by Git going forward.

## Change

**File: `.gitignore`**
- Add `.env` to the ignore list

This won't remove it from Git history (that would require a force push / history rewrite), but it will prevent future commits from including the file. As discussed, the keys in `.env` are publishable client-side keys, so there is no urgent security risk — this is just best practice hygiene.

