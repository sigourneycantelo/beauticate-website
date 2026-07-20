const LEMLIST_API_KEY = process.env.LEMLIST_API_KEY!
const LEMLIST_CAMPAIGN_ID = process.env.LEMLIST_CAMPAIGN_ID!

export async function addLeadToCampaign(email: string) {
  const res = await fetch(
    `https://api.lemlist.com/api/campaigns/${LEMLIST_CAMPAIGN_ID}/leads/${encodeURIComponent(email)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`:${LEMLIST_API_KEY}`).toString('base64')}`,
      },
      body: JSON.stringify({}),
    }
  )

  if (!res.ok && res.status !== 409) {
    throw new Error(`Lemlist error: ${res.statusText}`)
  }

  return res.json()
}
