# Contributing to the Beauticate site

How we work on this repo without breaking the live site or losing each other's
changes. **Vercel deploys from `main`, so anything merged to `main` goes live.**

## Roles & the branch model

- `main` is the live branch and is **protected**: it requires a pull request with
  one approval, and force-pushes/deletions are blocked.
- **Sigourney (admin)** may push small, confident editorial tweaks directly to
  `main`. Bulk or scripted changes should still go through a PR (see below).
- **Everyone else** works on a feature branch and merges via **pull request**.
  Direct pushes to `main` are rejected.

## First-time setup (important)

**Clone the repo from GitHub — do not work inside a shared Google Drive folder.**
Two people editing the same Drive-synced git directory can corrupt `.git`.
GitHub is the only place our work meets.

```bash
git clone https://github.com/sigourneycantelo/beauticate-website.git
cd beauticate-website
npm install
```

## The pull-request workflow (contributors)

1. **Branch off the latest `main`:**
   ```bash
   git checkout main && git pull origin main
   git checkout -b cleanup/<category>-<short-desc>      # e.g. cleanup/interviews-images
   ```
2. **Do the work.** Read [`docs/article-audit-and-fix.md`](docs/article-audit-and-fix.md)
   for the audit & fix process and [`CLAUDE.md`](CLAUDE.md) for the durable rules.
   Keep PRs small — **one category or one batch per PR** — so they're easy to
   review and conflict less with `main`.
3. **Commit and push the branch:**
   ```bash
   git add -A && git commit -m "fix(interviews): restore N body images"
   git push -u origin cleanup/interviews-images
   ```
4. **Open the PR:** `gh pr create --fill` (or via GitHub). Wait for the **Vercel
   preview deployment** to build.
5. **Review happens on the preview, not just the diff** — open the preview URL and
   look at the actual rendered articles you changed.
6. **Merge** once approved. Delete the branch.

### Keep your branch fresh

`main` moves while you work. Pull it into your branch often to avoid a painful
merge at the end:

```bash
git checkout main && git pull origin main
git checkout cleanup/interviews-images && git merge main
```

## Avoiding collisions

- **Divide by category.** Agree who owns which categories (`beauty-style`,
  `wellness`, `interviews`, …) so two people aren't editing the same MDX files.
- **Small, frequent PRs** beat one giant PR — less to conflict, faster to review,
  and a broken change is easy to revert.

## Reviewing a PR (Sigourney)

- Open the **Vercel preview** and spot-check the rendered articles — images load,
  shop grids render, no mangled markdown, hero looks crisp.
- Skim the diff for accidental changes (frontmatter, unrelated files, huge
  image blobs).
- Approve and merge. The merge deploys to live automatically.

## Commit messages

Use a short `type(scope): summary` line, e.g.
`fix(living): restore poolside images` / `docs: update audit playbook`.

## Don't

- Don't edit articles dated **on/after 2026-06-18** as if they have a WordPress
  source — they don't (see `CLAUDE.md`).
- Don't commit unresolved Git LFS pointer files or `git checkout` over them
  (see the gotchas in the audit playbook).
- Don't work in the Google-Drive-synced folder on a shared machine.
