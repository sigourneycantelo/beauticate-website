---
name: beauticate-travel-affiliates
description: The Travelpayouts travel affiliate system on Beauticate — the hotel and tours widgets, which one an article should carry, how destinations are resolved and verified, and the monthly earnings check. Use whenever a travel or destinations article is written, uploaded or refreshed, when asked to add a hotel or tours widget, when a widget isn't showing, when adding a new destination or widget type, and for the monthly review of what the widgets are actually earning.
---

# Beauticate travel affiliates (Travelpayouts)

Travel articles earn through **Travelpayouts**, which resells a catalogue of
travel brands. Two widget types are live. The editor-facing surface is one MDX
tag; everything else lives in `lib/travelpayouts.ts`.

**Account:** sigourney@beauticate.com, marker/ID **739667**, project
"Beauticate" (`trs=539775`). Widgets are at
app.travelpayouts.com → Tools → Widgets.

**Editor documentation:** [`docs/travel-widgets.md`](../../../docs/travel-widgets.md).
This skill is the operator's view — the decisions, the traps and the monthly job.

## The one-line version

```
<TravelWidget type="hotel_search" city="Saffire Freycinet, Coles Bay, Australia" />
<TravelWidget type="tours" city="Paris" />
```

## Which widget an article gets

**One widget per article. This is a hard limit** — two Travelpayouts widgets on
a page race each other, and the loser renders nothing. It is intermittent: the
same page can render both on one load and one on the next. Never stack them.

| The article is… | Use | Why |
|---|---|---|
| A review of one hotel | `hotel_search` pointed at **that hotel** | Nothing converts better than the exact property just described |
| A destination guide | `tours` | 8% on a **31-day** cookie vs 6% on **one day** |
| About a place with no GetYourGuide coverage | `hotel_search` | Tours renders nothing there |
| Not about a place at all | **Nothing** | A hotel box on a packing guide reads as a booking site |

The rates are the whole argument for tours: almost nobody books a trip the day
they read about it, and Agoda's one-day cookie throws away most of the intent an
article creates.

**Current split:** 9 tours, 26 hotels, 7 articles deliberately without.

## Destinations are looked up, never typed

This is the single most important rule here, and it is not caution — it is the
bug this system was built to stop.

**A destination the partner doesn't recognise does not error. It silently
resolves to something else.** The Kerala guide shipped `city="Kerala, India"`
and readers got a search box for **Kochi**, because Agoda has no Kerala entry.
Nothing in the page, the build or the console said so, for two months.

```bash
node scripts/resolve-travel-destination.mjs "Byron Bay"     # hotel destinations
node scripts/resolve-travel-destination.mjs --iata "Lisbon" # tours city codes
node scripts/resolve-travel-destination.mjs --check         # verify the whole site
```

Real results from building this, every one of which would have shipped a
perfectly good-looking widget:

| Typed | Reader would have got |
|---|---|
| Salt at Shoal Bay | Salta, **Argentina** |
| Bells at Killcare | Belfast, **United Kingdom** |
| QT Port Douglas | QT **Perth** |
| Santa Monica CA | Santa Mónica, **Uruguay** |

**Run `--check` before merging anything that touches a travel article.** It is
deliberately not in `npm run build`: it calls an external API, and a build that
fails because someone else's endpoint is slow is worse than the bug it catches.

### The two addressing schemes are different

- **`hotel_search`** takes an Agoda place **name**. Shorter is often righter:
  `"Nusa Lembongan"` resolves to the area, `"Nusa Lembongan, Indonesia"` to a
  hotel inside it.
- **`tours`** takes an **IATA city code**, mapped from the editor's `city`
  through `TOURS_CITIES` in `lib/travelpayouts.ts`.

**An airport code is not proof of coverage.** Mudgee has `DGE` and no
GetYourGuide tours at all; the widget degrades to a generic "View activities at
GetYourGuide" panel with a blurry stock photo and no button. So `TOURS_CITIES`
is an explicit hand-checked list: get the code, **render it and look at it**,
and only then add it. A good card shows the city's own name, its own copy and a
working "Find Things to Do" button.

## Everything fails silently, on purpose

A widget that cannot render correctly renders **nothing** — never an empty box.
Causes: no `NEXT_PUBLIC_TRAVELPAYOUTS_MARKER`, an unconfigured type (`map`,
`calendar`, `flights`), a tours city not in `TOURS_CITIES`, or a second widget
on the page. So a missing widget is a configuration question, not a layout bug.

## Disclosure is not optional

An article carrying a widget **must** set `affiliate_disclosure: true`. Four
articles in the first rollout had it explicitly `false` and were about to run an
undisclosed affiliate placement.

## Adding a new widget type

1. Find it in Tools → Widgets, "Customize and copy".
2. Read `promo_id` and `campaign_id` out of the copied `<script src>`. **They
   cannot be guessed** — without them the endpoint returns HTTP 400
   `promo_id is empty`, which is exactly how this integration sat dead and
   silent from July to September 2026.
3. Note its destination parameter by setting a known city in the customiser and
   watching the code change. They differ per widget.
4. Add a `WIDGETS` entry in `lib/travelpayouts.ts`. Set `themed: false` if it
   exposes no colour parameters.
5. Render it before believing it.

## Colours

`hotel_search` is themed through `THEME` in `lib/travelpayouts.ts` — one
`ACCENT` constant drives the button and icons. Currently **wine** (`#7a2733`);
ink (`#2a2621`) is the quieter alternative and the swap is one line.

`tours` has no colour parameters. It is a GetYourGuide-branded editorial card,
which is fine — it reads as content rather than as a form.

## The monthly check

Runs on the first Monday. About fifteen minutes.

1. **app.travelpayouts.com → Reports → Performance**, last 30 days. Look at
   clicks, bookings and revenue, split by **SubID** — every widget carries the
   destination as its SubID, so the report says which *article* earned what.
2. **Compare the two lanes.** Are the 9 tours articles out-earning the 26 hotel
   ones per placement? If tours wins clearly, move more destination guides
   across. If a hotel review is earning well, leave it alone.
3. **Look for zeroes.** A placement with clicks and no bookings may be pointing
   somewhere wrong; a placement with no clicks may be badly positioned in the
   article, or on a story nobody reads.
4. **Run `--check`.** Partner place lists change; a destination that resolved
   last month may not this month.
5. **Then tweak.** Swap a type, move a widget's position, or drop one that earns
   nothing. Record what changed and why, so the next month's comparison means
   something.

Balance was **$0** at the time of writing (September 2026) — the integration had
never worked. The first month's figures are the baseline, not a verdict.

## History worth not repeating

- Built July 2026, shipped **completely dead**: both scripts returned HTTP 400
  because the URLs were hand-assembled without `promo_id`. The only visible
  symptom was a 472px empty box on one article. Nobody noticed for two months.
- A sitewide `tp.media/content?marker=…` script was invented and never existed
  as a product. It 400'd on every page load of the whole site. Removed.
- Booking.com was the obvious hotel partner and is the wrong one: it pays 3–5%
  against Agoda's 6% and exposes **no** colour or destination options, so it can
  only ever be a blue box opening on an empty search.
- Captions once read "Search hotels in Saffire Freycinet, Coles Bay, Australia"
  — searching for hotels inside a hotel. The comma count now distinguishes a
  property from a place.

The pattern in all of it: **this system fails silently and beautifully.** Nothing
errors, nothing 404s, the page looks fine. Render it and look at it before
believing it works.
