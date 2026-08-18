const WOODPECKER_API_KEY = process.env.WOODPECKER_API_KEY!

interface AddProspectOptions {
  /** Space-separated hashtags, e.g. "#advertiser_lead" — Woodpecker has no per-list API targeting, so tags are how prospects get segmented/targeted by campaigns. */
  tags?: string
  firstName?: string
  lastName?: string
  company?: string
  website?: string
}

export async function addProspect(email: string, opts: AddProspectOptions = {}) {
  const prospect: Record<string, string> = { email }
  if (opts.tags) prospect.tags = opts.tags
  if (opts.firstName) prospect.first_name = opts.firstName
  if (opts.lastName) prospect.last_name = opts.lastName
  if (opts.company) prospect.company = opts.company
  if (opts.website) prospect.website = opts.website

  const res = await fetch(
    'https://api.woodpecker.co/rest/v1/add_prospects_list',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${WOODPECKER_API_KEY}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        update: 'true',
        prospects: [prospect],
      }),
    }
  )

  if (!res.ok) {
    throw new Error(`Woodpecker error: ${res.statusText}`)
  }

  return res.json()
}
