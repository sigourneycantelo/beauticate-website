# Beauticate docs

Process guides and playbooks for working on the Beauticate site. Most are written
for Claude / Claude Code to follow — **read the root [`CLAUDE.md`](../CLAUDE.md)
first** for the durable, project-wide rules, then the relevant guide below.

## Content & editorial

| Doc | Use it when |
|-----|-------------|
| [`updating-stories.md`](./updating-stories.md) | Publishing a **new** editorial story, or editing one. |
| [`migrating-articles.md`](./migrating-articles.md) | Auditing/upgrading an article already migrated from WordPress (the cleanup loop). |
| [`shoppable-story.md`](./shoppable-story.md) | Building a single-brand or product-led story that converts. |
| [`adding-products.md`](./adding-products.md) | Adding/featuring a product so it renders as a Beauticate card. |

## Article audit & fix (WordPress → Vercel reconciliation)

| Doc | Use it when |
|-----|-------------|
| [`article-audit-and-fix.md`](./article-audit-and-fix.md) | **Master playbook** — finding & fixing migration gaps (missing images, dropped text, broken markdown, flattened shop grids, fuzzy heroes). Start here. |
| [`wp-audit-process.md`](./wp-audit-process.md) | Deep dive on the audit **detector** internals (`scripts/audit-wp-vs-vercel.mjs`). |
| [`wordpress-sitemap-audit.md`](./wordpress-sitemap-audit.md) | Reference: the original WordPress sitemap & structure audit. |
| [`plugin-audit.md`](./plugin-audit.md) | Reference: the original WordPress plugin audit. |

## Shop / Shopify

| Doc | Use it when |
|-----|-------------|
| [`shopify-schema-snippets.md`](./shopify-schema-snippets.md) | Schema.org snippets for the Shopify storefront. |

---

> Keeping this index current protects against work being lost across sessions:
> when you add a doc, add a row here. Avoid duplicate copies of a guide — edits to
> one copy silently get lost in the other.
