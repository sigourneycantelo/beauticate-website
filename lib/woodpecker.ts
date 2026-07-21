const WOODPECKER_API_KEY = process.env.WOODPECKER_API_KEY!

export async function addProspect(email: string) {
  const res = await fetch(
    'https://api.woodpecker.co/rest/v1/add_prospects_list',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${WOODPECKER_API_KEY}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        prospects: [{ email }],
      }),
    }
  )

  if (!res.ok) {
    throw new Error(`Woodpecker error: ${res.statusText}`)
  }

  return res.json()
}
