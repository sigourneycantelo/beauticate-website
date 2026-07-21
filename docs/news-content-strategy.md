# Beauticate News Content Strategy

> How to consistently surface Beauticate content in Google News and AI answer
> engines without becoming a news wire. This is a playbook for editorial, not
> dev — the technical infrastructure (NewsArticle schema, news sitemap, AI
> crawler access) is already built.

---

## The principle

Beauticate is not a news site. It's an **authority that responds to news with
expertise**. That's the advantage: Google News rewards *credentialed commentary
published fast* over undifferentiated wire copy. A 400-word Sig take on a
trending ingredient beats a 1200-word SEO article with no byline.

The formula: **timeliness + named expert + a take** = Google News pickup.

---

## What counts as "news" at Beauticate

An article qualifies as NewsArticle (and goes in the news sitemap) when it's:

1. **Timely** — tied to something that happened in the last 7 days
2. **Dated** — the publish date is the actual day it went live (no backdating)
3. **Bylined** — a named author with credentials, not "Beauticate Editorial"
4. **Original** — your own reporting, reaction, or testing (not a rewrite of a press release)

### Formats that work

| Format | Example | Speed target |
|--------|---------|--------------|
| **Launch exclusive** | "Aesop is launching X (we tried it first)" | Same day as embargo lifts |
| **Expert reaction** | "Dermatologists respond to the retinol TikTok trend" | Within 24h of trend peak |
| **Event coverage** | "Inside the Chanel Beauté pop-up at Bondi" | Same day or next morning |
| **Seasonal drop** | "5 SPFs that just dropped for Australian summer" | First week of relevant month |
| **Award/list** | "Beauticate's 2026 Best of Beauty winners" | Day of announcement |
| **Interview exclusive** | "Miranda Kerr on Kora's new clinical range" | Timed to launch |
| **Trend first-take** | "Slug mucin is trending — here's what we actually think" | Within 48h of trend |

### Formats that are NOT news

- Evergreen how-tos, guides, listicles (these get Article or HowTo schema)
- Product reviews (these get Review schema — more valuable for commerce)
- Timeless interviews not tied to a launch or event
- "Best of" roundups without a dated hook

---

## Weekly news rhythm

Aim for **2–3 news-tagged articles per week**. This keeps the news sitemap
active and signals to Google that Beauticate is a consistent news publisher.

### Monday: Scan and assign

| Source | What to look for |
|--------|-----------------|
| Brand PR emails | Embargoed launches lifting this week |
| TikTok/Instagram trending audio | Beauty trends with 48h window |
| Google Trends (AU, beauty category) | Spikes in search interest |
| Competitor sites (Byrdie, Who What Wear AU) | Gaps they haven't covered with authority |
| Your own calendar | Events, interviews, podcast drops this week |

### Tuesday–Thursday: Publish window

Google News discovery is fastest mid-week. Aim to publish news-tagged pieces
Tuesday to Thursday between 7am–10am AEST (Australian morning = US evening,
catches both markets waking up).

### Friday: Wrap and seed

Publish any remaining news pieces. Seed next week's pipeline with confirmed
embargoes and planned events.

---

## How to tag an article as news

In the article frontmatter, add:

```yaml
is_news: true
```

That's it. The system handles the rest — NewsArticle schema, news sitemap
inclusion, and `news_keywords` meta tag are all automatic.

**Auto-detection:** Articles in `interviews/` or `destinations/` categories, or
tagged with `news`, `trending`, or `interview` get NewsArticle schema
automatically without needing `is_news: true`. Use the explicit flag for
beauty/style/wellness articles that are timely but wouldn't otherwise
auto-detect.

**Check script:** Run `node scripts/suggest-news-tag.mjs` before publishing to
see if any recent articles should be tagged as news. Run with `--all` for a
full-site audit.

---

## Minimum viable news article

Google News doesn't require 2000 words. The minimum for a credible news piece:

- **300+ words** of original content (not just a press release rewrite)
- **A headline that states what happened** — factual, specific, no clickbait
- **A named, credentialed author** — Sig, a Collective editor, or a bylined expert
- **A first-hand angle** — "we tried it", "we were there", "our take is"
- **Published within 48 hours** of the event/announcement
- **One image minimum** — original photo or supplied press image with proper alt text

---

## Google News Publisher Center

Beauticate has been approved in Google News for ~10 years. On domain switch
(July 20), update the Publisher Center settings:

1. Go to https://publishercenter.google.com/
2. Update the publication URL from the old WordPress domain to beauticate.com
3. Point the news sitemap at `https://www.beauticate.com/sitemap-news.xml`
4. Verify content labels are current: Beauty, Lifestyle, Wellness, Fashion

No re-approval needed — just a URL update. After that, news-tagged articles
appear in Google News within minutes of publication.

---

## Tracking success

After 30 days of consistent news publishing:

- Check Google Search Console → Performance → Search appearance → filter for
  "Google News" to see impressions and clicks
- Monitor `/sitemap-news.xml` — it should always have 2–6 articles in it
  (if it's empty for more than 3 days, you've gone quiet)
- Track which news formats get the most impressions — double down on those

---

## Content calendar template

| Week of | Mon (plan) | Tue–Thu (publish) | Fri (seed) |
|---------|-----------|-------------------|------------|
| Jul 21 | Scan embargoes + trends | 2–3 news articles | Confirm next week's hooks |
| Jul 28 | " | " | " |
| Aug 4 | " | " | " |

### Recurring hooks to watch

- **Monthly:** new product launches (brands email these ahead)
- **Seasonal:** SPF season (Oct), gifting guides (Nov), NYE beauty (Dec), back-to-routine (Feb)
- **Events:** Fashion Weeks (Feb/May/Sep), beauty awards season, clinic openings
- **Cultural:** Met Gala beauty, Oscars beauty, festival season looks
- **Trending:** monitor TikTok beauty hashtags weekly for breakout moments

---

## Who publishes news

Not every writer can publish a news piece credibly. For Google News E-E-A-T:

| Author | Best for |
|--------|----------|
| Sigourney | Launch exclusives, brand interviews, authority takes |
| Rae | Makeup trend reactions, product-launch first looks |
| Jocelyn | Skincare science news, ingredient trends |
| Dr Amy | Aesthetics/treatment news, clinical study reactions |
| Monique | Hair trend reactions, tool/tech launches |
| Zoe / Kristina | Fast-turnaround news beats, event coverage |

---

*Last updated: July 2026*
