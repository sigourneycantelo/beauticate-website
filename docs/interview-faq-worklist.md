# Interview archive: FAQ and name-variant worklist

Built 21 August 2026 from Google Search Console (`sc-domain:beauticate.com`),
8 July to 18 August. Companion to `docs/seo-recovery-worklist.md` Part D.

## The finding this comes from

People searching a bare name convert at 0.24%. People searching a name **plus a
specific question** convert at 2.01%, roughly eight times better, across 1,438
query/page pairs. When someone wants to know something about one of our
interviewees, our interview is a good answer and they click it.

65 query/page pairs sit at positions 3 to 20 with 60+ impressions, drawing 10,731
impressions and returning just 145 clicks. At the 5.9% our best name pages already
achieve, that pool is worth roughly 630 clicks per six weeks. That is an upper
bound, since the benchmark comes from our strongest rows.

## Three lanes, not one

Sorting the 65 by what they actually need splits them three ways, and the
cheapest lane is the one nobody would have predicted.

---

## Lane 1 - name variants: mostly a false alarm

**This lane was largely wrong when first written, and the correction matters.**

It inferred from the article *slugs* that our copy used the wrong name. It does
not. Checking the actual bodies and titles:

| Person | Slug says | Copy actually says | Verdict |
|---|---|---|---|
| Rachael Finch | `rachel-finch` | Rachael x29, Rachel x0 | already correct |
| Kristin Fisher | `kristen-fisher` | Kristin x32, Kristen x0 | already correct |
| Deborah Symond O'Neil | `deborah-symond` | O'Neil x12 | already correct |
| Lindy Rama-Ellis | `lindy-klim` | Rama-Ellis x9, Klim x3 | already correct |
| Abbey Gelmi | `abbey-gelmi` | Abbey x34 | correct; Abby/Abbie are searcher typos |
| Jennifer Hawkins | `jennifer-hawkins` | Jennifer x31 | correct; "Jen" is a nickname, not an error |
| **David Mallett** | `david-mallet` | **Mallet x18, Mallett x7** | **genuinely wrong, fixed** |
| **Terry de Gunzburg** | `terry-de-gunzberg` | **Gunzberg x2** | **genuinely wrong, fixed** |

Only two were real, and in both cases the misspelling sat in the metadata and the
existing FAQ entries while the body prose was already correct. Both are fixed:
`Mallet` to `Mallett` (11 places, verified against david-mallett.com) and
`Gunzberg` to `Gunzburg` (2 places, verified against byterry.com).

**No slug was changed.** The redirect map is still settling after the migration.

The consequence: spelling is *not* why these queries under-click. `rachael finch`
sits at position 11.7 on 924 impressions with one click while the page already
says Rachael 29 times. That is a position or SERP-feature problem, not a copy
problem, and it belongs with the position-1.1 anomalies described in Part D of
`seo-recovery-worklist.md`. Do not spend more effort here.

## Lane 2 - genuine questions (FAQ entries)

**The articles already have FAQs. Every one of the 26 checked carries three to
five.** The problem is that they all answer what Beauticate wants to talk about,
"What skincare does she use", "What is her makeup philosophy", while the queries
people actually type are biographical: age, wife, husband, parents, nationality,
sister, son.

So the job is not to add an FAQ block. It is to add the biographical questions
alongside the beauty ones, and only where the article itself supports the answer.

### Darren Palmer - `/interviews/creatives/darren-palmer-interiors-designer-and-olivier-duvillard`
`darren palmer son` (pos 9.2, 359 impr), `darren palmer son` (5.4, 148),
`darren palmer kids` (4.6, 98), `who is the mother of darren palmer's son` (8.0, 68),
`darren the block` (10.1, 60). **733 impressions, 18 clicks.**

### Abbey Gelmi - `/interviews/actors-presenters/abbey-gelmi-the-sports-reporter-making-her-thirties-all-about-finding-balance`
`abbey gelmi nationality` (7.0, 138 and 10.3, 86), `abbey gelmi parents` (4.1, 81
and 5.5, 64), `abbey gelmi sister` (4.0, 70). **439 impressions, 12 clicks.**
Already the best converter in the set, so the questions are clearly working.

### Julia Stone - `/interviews/creatives/julia-stone-the-musician-all-about-making-meaning`
`angus stone wife` (7.8, 326 and 7.9, 316), `julia stone partner` (7.9, 76),
`are angus and julia stone married` (5.5, 69). **787 impressions, 4 clicks.**
Note two of these are about her brother, not her.

### Melanie Grant - `/interviews/founders/the-exact-products-melanie-grant-uses-to-look-flawless`
`melanie grant skin` (7.9, 184 and 9.6, 144), `melanie grant skincare` (5.2, 68 and
5.2, 60). **456 impressions, 7 clicks.** Professional, on-brand, and commercially
useful since it leads into products.

### Sandra Sully - `/interviews/actors-presenters/sandra-sully-journalist-and-news-presenter`
`sandra sully husband` (9.9, 228), `sandra sully children` (6.2, 68),
`sandra sully twin sister` (7.3, 64). **360 impressions, 4 clicks.**

### Nathalie Kelley - `/interviews/actors-presenters/nathalie-kelley-the-actress-finding-her-purpose-outside-of-hollywood`
`nathalie kelley movies and tv shows` (10.1, 256), `nathalie kelley now` (7.2, 129).
**385 impressions, 3 clicks.** Small next to the bare-name volume, but these are
the winnable half of that query set.

### David Mallett - `/interviews/creatives/david-mallet-hair-stylist`
`david mallett hair` (4.7, 172 and 6.4, 108). **280 impressions, 16 clicks**, a
5.7% CTR. Already the strongest performer here, worth protecting.

### Shorter ones
- **Dina Broadhurst** `dina broadhurst age` (3.5, 239 impressions across two rows, **0 clicks**). Position 3.5 and nothing. Worth a look on its own.
- **Amalie Gassmann** `amalie gassmann parents` (5.3, 112 and 4.4, 62) - 8 clicks, converting well already
- **Sari Ella Thaiday** `is sari thaiday related to sam thaiday` (4.7, 83 and 6.5, 82)
- **Kristen Fisher** `kristin fisher eyebrows reviews` (5.7, 186)
- **Lisa Messenger** `lisa messenger age` (9.7, 166)
- **Brooke Blurton** `brooke blurton father` (4.7, 100)
- **Bianca Spender** `bianca spender husband` (7.4, 99)
- **Silvana Philippoussis** `mark philippoussis wife` (5.5, 118)
- **Sibella Court** `sibella court age` (3.4, 78) - 4 clicks, 5.1%
- **Felicia Oreb** `sebastian oreb wife` (9.6, 64)
- **Jacqueline Alwill** `jacqueline alwill husband` (5.1, 60) - 3 clicks, 5%
- **Sarah Jagger** `is sarah jagger still married` (7.0, 60)

---

## Lane 3 - needs Sig's call, do not action

Seven queries, about 1,430 impressions. Answering them would lift clicks and would
also change what Beauticate is. **Nobody should work down this list without Sig
deciding the line first.**

| Query | Pos | Impr | Article |
|---|---|---|---|
| darren palmer ex wife (x2) | 5.3, 6.0 | 864 | Darren Palmer |
| is darren palmer gay | 4.8 | 214 | Darren Palmer |
| darren palmer gay | 3.4 | 63 | Darren Palmer |
| brooke blurton dad | 5.7 | 138 | Brooke Blurton |
| anastasia soare net worth | 10.6 | 76 | Anastasia Soare |
| zanna roberts rassi weight loss | 8.5 | 72 | Zanna Roberts Rassi |

Worth saying plainly: Darren Palmer's piece is co-bylined with his husband
Olivier Duvillard, so `is darren palmer gay` is answered simply by the article
existing. Whether to make that explicit is still an editorial choice, not an
SEO one.

---

## Excluded

`stella kim snsd` (127 and 97 impressions) is people looking for the K-pop singer
from Girls' Generation, not our Stella Kim. Do not write an FAQ for it.

## Rules

1. **Never invent a fact about a real person.** If the answer is not already in
   the article or verifiable from a reliable source, leave the question out.
   These are living people and a wrong answer in FAQPage schema is worse than
   no answer.
2. **Do not change slugs.** The redirect map is only just settling after the
   migration.
3. Answers go in the `faqs` frontmatter array, not the body.
4. Keep answers to one or two factual sentences. This is not the place for voice.
5. `date_modified` only moves where the content actually changed.
