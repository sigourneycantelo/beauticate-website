# Brief: update Beauticate Shop legal pages

Four legal pages have been rewritten for the brand-direct dropship model. Please replace the copy on the existing pages with the four markdown files supplied. Do not redesign the pages, just swap the body content.

## Files and where each goes

| File | Page | Route |
|---|---|---|
| `1-privacy-policy.md` | Privacy Policy | `/privacy` |
| `2-terms-and-conditions.md` | Terms & Conditions | `/terms` |
| `3-shipping-policy.md` | Shipping Policy | `/shop/shipping` |
| `4-returns-and-refunds.md` | Returns & Refunds | `/shop/refund-policy` |

Match these to the current route names in the repo if they differ. Keep the existing page layout, header and footer.

## One placeholder to wire up

In `3-shipping-policy.md` there is a link: `[our free-shipping brands](/shop/free-shipping)`. Point this at the real collection or page that lists the brands offering free shipping. If that page does not exist yet, create the route or leave the link and flag it, do not delete the sentence.

## Rules

- Australian English throughout. Do not change spellings to US English.
- Do not add em dashes. Keep the copy as written.
- The operator entity is Cantelo Corporation Pty Ltd (ABN 71 105 175 317), trading as Beauticate. No street address anywhere, this is intentional.
- Contact email is `hello@beauticate.com` on every page.
- The old `.shop` domain should 301-redirect to `beauticate.com/shop`.
- Set each page's "last updated" to the go-live date if it is later than July 2026.

## Still open, safe to ship without

- Free-shipping model: page states some brands ship free and others charge a per-brand rate. No dollar threshold is promised. If a threshold is added later it is a copy change to the Shipping page only.
- Postal address: email-only for now. A PO Box or virtual address can be added to the contact blocks later if wanted.
