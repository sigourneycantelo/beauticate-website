# Build output size, and the ENOSPC trap

Vercel builds this project on a **4-core, 8GB machine**. Twice now the build has
been at or over that limit for the same reason, and the error it produces is
actively misleading. This is what to look for.

## The failure

```
Build Failed
ENOSPC: no space left on device, write
```

It appears while **collecting build traces** — after every page has generated
successfully, ten minutes into the build, with no reference to the code that
caused it. It does not reproduce locally on a machine with spare disk.

## The cause

`@vercel/nft` decides which files ship inside each serverless function. When it
meets a filesystem read whose path it cannot resolve statically —

```ts
fs.readFileSync(path.join(process.cwd(), 'public', src))   // src known only at runtime
```

— it cannot know which file is wanted, so it conservatively traces **everything
under that root**. `public/` is a 3.3GB tree of article photography. Every
dynamic route able to reach that code gets its own 3.3GB copy.

## What it looked like

| | build output |
| --- | --- |
| Two article routes reading `public/` per request | 7.32 GB |
| A third route added (the RSS feed, #84) | 10.91 GB → **ENOSPC** |
| After precomputing dimensions (#89) | **0.58 GB** |

The article routes were never *doing* anything wrong at request time. They
genuinely needed image dimensions. The cost was entirely in what nft had to
assume.

## The fix, and the rule

`scripts/build-image-dimensions.mjs` indexes every image under `public/` into
`data/image-dimensions.json` (~21,000 entries, 2.26MB). Consumers look
dimensions up in that manifest, read from **one literal path**, which nft
resolves to a single file.

**That step costs about 155s on a cold page cache**, which is what CI always
has. An earlier note here said ~3s; that was measured immediately after another
pass had already read all 21,000 files, so it timed the cache rather than the
work. Reading 2.8GB of image headers is inherently I/O-bound and the concurrency
in that script does not change much about it.

It is still a large net win — the build went from ~11 minutes to ~3m43s, because
copying 6.6GB into two lambdas cost far more than reading the headers once — but
be aware that **the manifest step is now the single largest item in the build**.
If it needs to come down, the lever is incremental work (persist the manifest
across builds via the Vercel build cache and re-stat only what changed), not
more parallelism.

**The rule: never assemble a filesystem path from a runtime value in code a
dynamic route can reach.** Literal paths are fine — `app/.well-known/llms.txt`
reads `public/llms.txt` and traces 54 files, because nft can see exactly which
file it means.

Where a runtime path is genuinely unavoidable, the escape hatch is an
`outputFileTracingExcludes` entry **scoped to that route** (see
`next.config.ts`, where `/feed.xml` and `/sitemap-news.xml` use it). Never widen
that to `'*'` — it would strip files that other routes really do read at request
time, and that breaks quietly in production rather than loudly at build.

## How to check before you ship

Function bundle sizes are in the build output:

```bash
npm run build
python3 - <<'EOF'
import json, os, glob
rows = []
for p in glob.glob('.next/server/**/*.nft.json', recursive=True):
    base = os.path.dirname(p); total = 0
    for f in json.load(open(p))['files']:
        try: total += os.path.getsize(os.path.normpath(os.path.join(base, f)))
        except OSError: pass
    rows.append((total / 1e6, p))
rows.sort(reverse=True)
for mb, p in rows[:5]:
    print(f'{mb:9.1f} MB  {p}')
print(f'TOTAL {sum(r[0] for r in rows) / 1000:.2f} GB')
EOF
```

Healthy today is well under 1GB total, with no single bundle above ~25MB. If one
route is suddenly hundreds of megabytes, look for a filesystem read it can reach
whose path is not a literal.
