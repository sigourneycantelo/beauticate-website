# Beauticate WordPress Plugin Audit

Audited from live WordPress backend: beauticate.com
Date: 2026-06-18
Total plugins: 54 | Active: 48 | Inactive: 6

---

## Active Plugins → Next.js Equivalents

### Performance & Images

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **a3 Lazy Load** | Active | Lazy loads images, iframes, videos on scroll | ✅ Built into Next.js — `next/image` lazy loads by default. No plugin needed. |
| **Autoptimize** | Active | Minifies CSS/JS/HTML, defers scripts, optimises Google Fonts | ✅ Next.js handles JS/CSS bundling + minification. Use `next/font` for Google Fonts (zero layout shift). |
| **reSmush.it Image Optimizer** | Active | Compresses images on upload (JPEG/PNG/GIF) | ✅ Use Vercel's built-in image optimisation (serves WebP/AVIF automatically) or **Cloudinary** for more control. |
| **Cloudflare** | Active | CDN, caching, DDoS protection, DNS | ✅ Keep Cloudflare — proxy Vercel through Cloudflare for CDN + security. Works natively together. |
| **SVG Support** | Active | Allows SVG uploads and inline SVG rendering | ✅ Native in Next.js — import SVGs as React components with `@svgr/webpack`. |

### SEO

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **Yoast SEO** | Active | Meta tags, XML sitemap, robots.txt | ✅ `next-seo` + `generateMetadata()` (App Router). Richer and more flexible than Yoast. |
| **Yoast SEO Premium** | Active | Redirects, internal linking, social previews, schema | ✅ Redirects → `next.config.js`. Schema → `schema-dts`. Sitemap → `next-sitemap`. |
| **Redirection** | Active | 301/302 redirect management, 404 monitoring | ✅ `next.config.js` redirects array. With 1,700+ articles, export redirect rules from WordPress and import to config. |
| **Remove Category URL** | Active | Removes `/category/` prefix from URLs (e.g. `/beauty-style/` not `/category/beauty-style/`) | ✅ Next.js routes are defined by folder structure — just build routes as `/[category]/[slug]` with no prefix. |

### Commerce

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **WooCommerce** | Active | eCommerce engine | ✅ Remove (as agreed) — replaced by Shopify Storefront API. |
| **WooCommerce Stripe Gateway** | Active | Stripe payments via WooCommerce | ✅ Shopify handles payments natively. |
| **ShopWP** | Active | Embeds Shopify products/collections in WordPress | ✅ Build natively using Shopify Storefront API GraphQL — no wrapper plugin needed. |
| **Shopify** | Active | Shopify–WordPress connector | ✅ Replaced by direct Storefront API integration. |
| **WSW – Multi channel selling** | Inactive | Import Shopify products to WooCommerce | ❌ Not needed. |

### Social & Feeds

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **Smash Balloon Instagram Feed** | Active | Displays Instagram feed on site | ⚠️ **Instagram Basic Display API** (deprecated by Meta). Best replacement: **Curator.io** or **EmbedSocial** (embeddable, no API keys). Or build a server-side component hitting Instagram Graph API with a long-lived token. |
| **Feeds for YouTube** | Active | Displays YouTube channel feed | ✅ **YouTube Data API v3** — simple `fetch` in a Next.js Server Component, cached. Free up to 10,000 requests/day. |
| **Blog2Social** | Active | Auto-posts new content to Facebook, Instagram, LinkedIn, TikTok etc | ⚠️ Not replicated in Next.js itself. Use **Zapier** or **Make (Integromat)** triggered by a Vercel deploy webhook. Or migrate to **Buffer** or **ClickSocial** (already installed — see below). |
| **ClickSocial** | Active | Social media scheduler (Smash Balloon product) | ✅ Keep as a standalone tool — connect directly to Beauticate's social accounts. Does not need to be embedded in WordPress. |
| **WP Twitter Auto Publish** | Active | Auto-posts to Twitter/X on publish | ✅ Replaced by ClickSocial or a Zapier automation triggered by new content. |
| **Meta Pixel for WordPress** | Active | Facebook/Instagram ad pixel | ✅ Add Meta Pixel as a `<Script>` component in Next.js `app/layout.tsx`. One line. |

### Analytics

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **Google Analytics (MonsterInsights)** | Active | GA4 integration | ✅ `@next/third-parties` — Google's official Next.js GA4 integration. Dead simple. |

### Email & Lead Capture

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **SumoMe / BDOW** | Active | Email popups, scroll boxes, welcome mats | ⚠️ Sumo works as an external embed — add the Sumo script via `<Script>` in layout. OR migrate to **Klaviyo** popups (better for email segmentation + ecommerce integration with Shopify). |
| **HubSpot All-In-One** | Inactive | Forms, popups, live chat, CRM | ⚠️ Inactive — if you want live chat/forms, add HubSpot tracking code via `<Script>`. Or use **Intercom** / **Tidio** instead. |
| **HubSpot Content Embed** | Inactive | Personalised HubSpot content blocks | ❌ Not needed if HubSpot not in use. |

### Search

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **Ivory Search** | Active | Custom search with AJAX live search | ✅ **Pagefind** — free, runs at build time, zero hosting cost, fast. Or **Algolia** for real-time search with typo tolerance (has a free tier). |

### Content & Media

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **Advanced Custom Fields (ACF)** | Active | Custom meta fields on posts | ✅ Replaced by MDX frontmatter fields — same concept, no database needed. |
| **ACF Photo Gallery Field** | Active | Gallery field type for ACF | ✅ Frontmatter `gallery: []` array in MDX. |
| **WP Carousel** | Active | Image carousels, sliders, galleries | ✅ **Embla Carousel** (lightweight, accessible, no dependencies) or **Swiper.js**. Both integrate cleanly with React. |
| **Related Posts By Taxonomy** | Active | Shows related posts based on shared categories/tags | ✅ Build as a server component — query MDX files by category/tag at render time. Claude handles related product/article linking in frontmatter too. |
| **Ultimate Blocks** | Active | Gutenberg content blocks (call to action, review boxes etc) | ✅ Build as React components — Button, CallToAction, ReviewCard, FAQPanel etc. |
| **Classic Editor** | Active | Keeps the old WordPress post editor | ❌ Not needed — Claude generates all content. |
| **WPBakery Page Builder** | Active | Drag-and-drop page builder | ❌ Replaced by React components + Tailwind. |
| **Ultimate Addons for WPBakery** | Active | Extra WPBakery elements | ❌ Not needed. |
| **Elementor** | Active | Page builder | ❌ Replaced by React components. |
| **Elementor Pro** | Active | Advanced Elementor features | ❌ Replaced by React components. |
| **Essential Addons for Elementor** | Active | Extra Elementor widgets | ❌ Replaced by React components. |
| **Beauticate Addons** | Active | Custom theme shortcodes | ❌ Not needed. |
| **Beauticate Options** | Active | Custom theme options | ❌ Not needed. |

### Developer / Admin Tools

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **Head & Footer Code** | Active | Inject code into `<head>` / `<body>` | ✅ `app/layout.tsx` — add any scripts, meta tags, or pixels directly. |
| **WPCode Lite** | Active | Code snippets with conditional logic | ✅ Handled in Next.js layout/middleware. |
| **Simple Custom CSS and JS** | Active | Add custom CSS/JS | ✅ Tailwind + component-scoped CSS. |
| **Search Regex** | Active | Find & replace across posts/pages | ✅ Not needed in Next.js — content lives in text files, use VS Code find & replace or a script. |
| **WP File Manager** | Active | File manager in WP dashboard | ❌ Not needed. Use VS Code / Finder. |
| **Broken Link Checker** | Active | Finds broken links across the site | ✅ **Lychee** (CLI, free, run in CI) or **ahrefs** site audit (already in your marketing stack likely). |
| **Podcast Importer SecondLine** | Active | Imports podcast RSS feed into WordPress | ✅ Fetch Spotify/RSS feed directly in a Next.js Server Component. Or embed Spotify player widget. |
| **Max Mega Menu** | Active | Mega dropdown navigation menus | ✅ Build as a React component — full control over layout, animations, and mobile behaviour. |

### Spam & Security

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **Akismet** | Active | Comment spam protection | ✅ If comments enabled, use **Disqus** or **Giscus** (GitHub-based, free). Both handle spam. Or drop comments entirely — most editorial sites have. |
| **Antispam Bee** | Active | Comment spam protection (GDPR-friendly) | ✅ Same as above — handled by comment platform. |

### Ads

| WordPress Plugin | Status | Purpose | Next.js Replacement |
|---|---|---|---|
| **Ad Inserter Pro** | Active | Insert ads at specific positions in content | ✅ Build an `<AdSlot>` React component that accepts a position prop. Inject Google Ad Manager or direct ad code. Wrap in `dynamic()` with `ssr: false` so ads don't block server render. |

---

## Inactive Plugins (can be ignored / deleted from WordPress)

| Plugin | Notes |
|---|---|
| HubSpot All-In-One Marketing | Inactive |
| HubSpot Content Embed | Inactive |
| Imagify | Inactive (duplicate of reSmush) |
| Image Optimizer (Elementor) | Inactive |
| Smush | Inactive (duplicate image optimiser) |
| WSW Multi Channel Selling | Inactive |

---

## Summary: What Next.js Handles Natively (No Plugin Needed)

- Lazy loading images → `next/image`
- Image resizing & format conversion (WebP/AVIF) → `next/image` + Vercel
- Font optimisation → `next/font`
- JS/CSS minification & bundling → built in
- SVG as components → `@svgr/webpack`
- Code splitting → built in
- Caching & CDN → Vercel Edge Network + Cloudflare

## Decisions Needed

| Topic | Options |
|---|---|
| **Instagram feed** | Curator.io / EmbedSocial (easiest) vs custom Instagram Graph API integration |
| **Search** | Pagefind (free, static) vs Algolia (real-time, has cost) |
| **Email capture / popups** | Keep Sumo (embed script) vs migrate to Klaviyo (better Shopify integration) |
| **Comments** | Drop them / Disqus / Giscus |
| **Social auto-posting** | ClickSocial (already have it) vs Buffer vs Zapier automation |
| **Live chat** | Not currently active — HubSpot inactive. Add Tidio/Intercom or skip? |
