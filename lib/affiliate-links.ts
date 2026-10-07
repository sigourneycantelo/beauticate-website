/**
 * Skimlinks protection for links that already carry their own affiliate tracking.
 *
 * The Skimlinks script (app/layout.tsx) is loaded site-wide as a catch-all that
 * monetises bare retailer links — the long tail we haven't hand-mapped. That is
 * what it is for, and links like the ~1,200 bare mecca.com.au ones should keep
 * going through it.
 *
 * It must NOT touch links that are already tracked. Skimlinks claims to respect
 * pre-existing affiliate links, but it only recognises the formats of networks it
 * knows. A direct brand code appended as a query parameter — Social Snowball's
 * `?snowball=`, Refersion's `?rfsn=`, UpPromote's `?sca_ref=` — looks like a plain
 * merchant link to it, so it wraps it.
 *
 * Observed on a live Qure link: the click was rewritten to go.skimresources.com and
 * routed through CJ Affiliate, arriving with `cjevent` and `cjdata` set alongside
 * our own `snowball=`. A hard CJ click id competing with the direct code means the
 * commission goes CJ -> Skimlinks -> us minus their cut, instead of to the direct
 * programme. That is the affiliate vault's "one tracking method per product, never
 * mix" rule being broken at runtime.
 *
 * `rel="noskim"` and `class="noskim"` are Skimlinks' documented per-link opt-outs.
 * Both are applied: they are harmless together and we cannot reach the vendor docs
 * from CI to confirm which single form is canonical.
 */

/** Query parameters that carry a direct brand affiliate code. */
const TRACKING_PARAMS = ['snowball', 'sca_ref', 'rfsn', 'camref', 'awinaffid', 'irclickid']

/** Hosts belonging to affiliate networks whose links are already tracked. */
const NETWORK_HOSTS = [
  'prf.hn', 'pxf.io', 'sjv.io', 'cfjump.com', 'awin1.com',
  'go.redirectingat.com', 'rstyle.me', 'shareasale.com', 'anrdoezrs.net',
  'dpbolvw.net', 'jdoqocy.com', 'kqzyfj.com', 'tkqlhce.com',
]

/**
 * Brands we have a direct deal with, where our own code lives in the URL PATH
 * (`nooksaunas.com.au/BEAUTICATE`, `5minuteblinds.com.au/ref/Beauticate`)
 * rather than in a query parameter. Nothing in TRACKING_PARAMS can see a code
 * in the path, so Skimlinks treated these as bare merchant links and wrapped
 * them in go.skimresources.com: the click goes through Skimlinks instead of our
 * direct deal, and the brand's own attribution is bypassed.
 *
 * Found on the Nook Elite review. A host belongs here only when we hold our own
 * code or link for it. Add one when a new direct deal is signed.
 */
const DIRECT_DEAL_HOSTS = ['nooksaunas.com.au', '5minuteblinds.com.au']

function hostOf(href?: string): string | undefined {
  if (!href || !/^https?:\/\//i.test(href)) return undefined
  try {
    return new URL(href).hostname.toLowerCase()
  } catch {
    return undefined
  }
}

/** A link to a brand we have a direct deal with. These are paid links. */
export function isDirectDeal(href?: string): boolean {
  const host = hostOf(href)
  return !!host && DIRECT_DEAL_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
}

/**
 * True when a URL already carries affiliate tracking and Skimlinks must leave it
 * alone. Untracked links return false so the catch-all can still monetise them.
 */
export function hasOwnTracking(href?: string): boolean {
  if (!href || !/^https?:\/\//i.test(href)) return false
  if (isDirectDeal(href)) return true
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return false
  }
  const host = url.hostname.toLowerCase()
  if (NETWORK_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return true
  return TRACKING_PARAMS.some((p) => url.searchParams.has(p))
}

/**
 * Merge `noskim` into an existing rel, preserving whatever the author set
 * (notably `sponsored`, which the disclosure rules require on paid links).
 */
export function withNoskim(rel: string | undefined, href?: string): string | undefined {
  if (!hasOwnTracking(href)) return rel
  const tokens = new Set((rel ?? '').split(/\s+/).filter(Boolean))
  tokens.add('noskim')
  return Array.from(tokens).join(' ')
}

/** Append the `noskim` class when the link is already tracked. */
export function withNoskimClass(className?: string, href?: string): string | undefined {
  if (!hasOwnTracking(href)) return className
  return className ? `${className} noskim` : 'noskim'
}
