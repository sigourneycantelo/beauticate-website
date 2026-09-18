# Travel widgets — how to add one

A travel widget is a live hotel or flight search box inside an article. A reader
searches, books on the partner's site, and Beauticate earns commission through
Travelpayouts. They belong on travel stories and destination listings, not on
interviews that happen to mention Paris.

## Adding one

One line in the article body, wherever it should sit:

```
<TravelWidget type="hotel_search" city="Sydney" />
```

That's the whole job. No URL, no dashboard, no code.

### The types

| `type` | What the reader sees | Status |
|---|---|---|
| `hotel_search` | Agoda search form — destination, dates, Search | **Live.** Use this |
| `flights` | Flight search form | Not configured — renders nothing |
| `map` | — | Not configured; Travelpayouts has no hotel map widget |
| `calendar` | — | Not configured; the calendar widgets are for tours, not hotels |

`hotel_search` uses Agoda rather than Booking.com. Agoda pays 6% against
Booking's 3–5%, and — the deciding factor — Booking's widget offers no colour
or destination options at all, so it can only render as a blue box that opens
on an empty search.

### `city` — write it as "City, Country"

The widget matches against Agoda's own place list, so give it the full form:

    city="Sydney, Australia"
    city="Ubud, Indonesia"
    city="Byron Bay, Australia"

A bare `"Sydney"` may still resolve, but the two-part form is the one that's
been checked. Leave `city` off entirely and the reader gets an empty search
box, which converts far worse — always set it.

Where an article isn't about one place (a packing guide, a round-up), use the
nearest real destination it does discuss rather than forcing one in.

### Optional extras

```
<TravelWidget type="hotel_search" city="Ubud" caption="Where we stayed in Ubud" />
```

- `caption` — the line under the widget. Defaults to something sensible
  ("Search hotels in Ubud"), so only set it if you want different words.
- `subid` — a label for reporting, so Travelpayouts shows which article earned
  what. Defaults to the city. Set it when one article carries several widgets.
- `height` — reserved height in px. Rarely needed; the defaults are tuned per type.

## Where to put it

Mid-article, after the section that makes the reader want to go — usually just
after the hotel or neighbourhood you've described. Not in the intro, before
they're sold, and not stranded at the very end.

**One per page — this is a hard limit, not taste.** Two `hotel_search` widgets
on the same page and *neither* renders: Travelpayouts serves one instance of a
widget per document, and the second silently kills the first. Checked in the
browser. If a guide covers two cities, pick the one the reader is most likely
to book and link the other in prose.

## If it doesn't show up

It renders nothing on purpose when it can't render properly. That's the design:
a missing widget is invisible, never a broken empty box. The two causes:

1. **No marker set.** `NEXT_PUBLIC_TRAVELPAYOUTS_MARKER` isn't in the
   environment — normal in local dev. It works on the live site.
2. **That widget type isn't configured yet.** Its `promoId` in
   `lib/travelpayouts.ts` is still blank — true today of `map`, `calendar` and
   `flights`. Fill it from the dashboard embed code.
3. **There's already a widget on the page.** See the one-per-page limit above.

Both are silent by design, so if you've added a widget and see nothing on the
live site, check `lib/travelpayouts.ts` before assuming it's a layout bug.

## Colours

Out of the box these widgets are Travelpayouts blue — blue button, blue border,
blue calendar icons, rounded corners. `THEME` in `lib/travelpayouts.ts` maps
them onto the house palette instead: wine button and icons, soft greige border,
square corners, eucalypt focus ring. The accent is a single `ACCENT` constant at
the top of `THEME` — change that one line and every widget on the site changes
at once. (Ink, `#2a2621`, is the quieter alternative if wine proves too loud.)
Never restyle one widget in an article.

The brand's own logo keeps its colours — that part isn't ours to change.

## Disclosure

These are affiliate placements. An article carrying one should have
`affiliate_disclosure: true` in its frontmatter, which prints the standard line
at the foot of the page.
