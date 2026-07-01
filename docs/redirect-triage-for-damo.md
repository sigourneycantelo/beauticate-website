# Redirect audit — RESOLVED

The 73 legacy dead-end redirects flagged earlier have been resolved automatically. **Nothing here needs action** except the two notes at the bottom.

What they turned out to be (they were **not** broken articles — the *redirects* had the wrong forwarding address):

- **62** — the article is live on the site; the redirect just pointed at a stale URL. Repointed each to the real (verified 200) URL.
- **11** — genuinely dead or junk (`/product/test`, `/staging/go-tos`, `/tag/products`, `/tag/video/page/2`, old `/beauty-style/hairstyles` category, old pagination). Redirect deleted so the URL 404s cleanly rather than redirecting to a 404.

After this pass, **every remaining redirect in `next.config.ts` resolves to a live 200 page.**

## Two articles worth a quick look (optional)
These two had a redirect but the article itself is missing/unpublished, so the redirect was deleted. If either should be live, it needs republishing (content task, not a redirect fix):
- `/wellness/ultrahuman-ring-air-review` — an Ultrahuman ring review
- `…/struggling-to-sleep-this-mattress-changed-everything-for-me` — a mattress review
