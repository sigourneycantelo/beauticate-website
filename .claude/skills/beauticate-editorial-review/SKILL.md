---
name: beauticate-editorial-review
description: Get an article PR in front of Sig for review — find the direct Vercel preview link (not the homepage) and post it, along with the PR link and any open editorial questions, onto that article's existing Asana card on the Editorial Calendar board. Use whenever asked to link a PR to its Asana card, find/share the preview link for an article, check what's waiting on Sig's review, or push a fix to an already-open article PR. Complements the article-upload agent, which runs this same linking step automatically as its last stage.
---

# Beauticate editorial review linking

Full mechanics: [`docs/asana-editorial-linking.md`](../../../docs/asana-editorial-linking.md).

The short version, for anything that isn't a full `article-upload` run —
someone asks you to check on a PR, re-share a preview link, or link a card
that got missed:

1. **There is already an Asana card for this article.** Sig drafts it on
   Editorial Calendar before anyone writes a word, and the uploader works
   from it. Find it yourself — search Editorial Calendar for incomplete
   tasks assigned to the uploader, narrowed by title/keyword match against
   the article — it's usually obvious and rarely needs asking. Only ask if
   the search turns up more than one plausible card or none at all. **Never
   create a new one** — a duplicate card is the failure mode this skill
   exists to prevent.
2. **Get the direct article link**, not the bare preview domain. Vercel's PR
   comment links to the deployment root, which only renders the homepage.
   Pull the preview domain from that comment and append
   `/<category>/<subcategory>/<slug>`.
3. **Comment on the existing card** (don't overwrite its notes) with the
   direct article link, the PR link, and any open editorial questions from
   the PR body. Reassign it to Sigourney if the reassignment call succeeds;
   if it errors, just say so in the comment rather than retrying repeatedly.
4. **Making a change she asks for**: push the fix directly to the PR's
   branch yourself (same-repo branches only — check
   `gh pr view --json isCrossRepository`). Don't route it back through the
   original uploader unless she asks you to.
5. Leave the card incomplete. She marks it done when she's ready to merge.
