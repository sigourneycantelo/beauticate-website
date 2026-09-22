# Asana ↔ article pipeline: linking, not creating

## How the team actually works

Sig drafts the Asana card first, on the **Editorial Calendar** project
(`1210982103329520`), before anyone writes a word. The uploader — Rikki, or
anyone else doing story uploads — works *from* that card. By the time an
article reaches a Claude session for upload, the Asana card already exists.

**The one rule: link the existing card, never create a new one.** A new task
per article is clutter that duplicates what's already on the editorial plan
and breaks the one-place-to-look habit the board exists for.

## What "linking" means in practice

Once the PR is open and Vercel has deployed a preview:

1. **Get the direct article URL**, not the bare preview domain. Poll
   `gh pr view <number> --json comments` for Vercel's `[vc]:` bot comment —
   the preview domain is inside it (base64-encoded `previewUrl`, or just grep
   the rendered comment for the `vercel.app` link). Build:
   `https://<preview-domain>/<category>/<subcategory>/<slug>`
   The bare domain alone only loads the homepage — this is the single biggest
   source of "I can't find the article" confusion, so never hand over just the
   root preview URL.
2. **Comment on the existing Asana card** with:
   - The direct article preview link
   - The PR URL
   - Any open editorial questions surfaced in the PR body (disclosure status,
     hero placement, anything flagged as needing Sig's call)
   Use `add_comment`, not `update_tasks` on the `notes` field — the card's
   original brief (what Sig wrote when she drafted it) should stay intact;
   the review links are an update, not a rewrite.
3. **Reassign the card to Sigourney** (`sigourney@beauticate.com`) so it moves
   into her queue once it's her turn to look at it. (Note: the Asana MCP's
   `update_tasks` tool has been flaky about its `tasks` parameter shape in
   practice — if reassignment errors out, don't burn more than one or two
   retries on it. Say so in the comment instead and let Sig reassign by hand;
   it's a two-click fix for her and not worth blocking the rest of the flow.)
4. **Leave the task incomplete.** Sig marks it complete herself once she's
   happy to merge, or comments back with what needs changing.

## Finding the card when the link wasn't given

Always ask for the Asana card link/GID up front rather than guessing — see
the `article-upload` agent's intake list. If someone genuinely doesn't have
it to hand:

- Search the **Editorial Calendar** project by article title
  (`search_tasks`, scoped to that project). Titles are hand-typed by Sig and
  won't always match the eventual slug or SEO title exactly — use judgement,
  and if more than one card plausibly matches, ask which one rather than
  guessing.
- If nothing matches at all, that's a signal the workflow was skipped
  upstream (no card was drafted before upload) — flag it to Sig rather than
  silently creating one. Creating a task is the one action this doc asks you
  never to take unprompted.

## Making a fix after the card is already linked

If Sig (or anyone) asks for a change to an article that already has an open
PR: commit and push directly to that PR's branch rather than routing the
request back through the original uploader. Check
`gh pr view --json isCrossRepository` first — this only works cleanly for
same-repo branches, which is how everyone on this project works. Push a new
commit; the same Vercel preview URL updates automatically, so the Asana
card's link doesn't need to change.
