const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY!
const LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!
const BASE_URL = 'https://a.klaviyo.com/api'

export async function subscribeToList(email: string, firstName?: string) {
  const res = await fetch(`${BASE_URL}/profile-subscription-bulk-create-jobs/`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      revision: '2024-10-15',
      'content-type': 'application/json',
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [{
              type: 'profile',
              attributes: {
                email,
                first_name: firstName,
                subscriptions: {
                  email: { marketing: { consent: 'SUBSCRIBED' } },
                },
              },
            }],
          },
        },
        relationships: {
          list: { data: { type: 'list', id: LIST_ID } },
        },
      },
    }),
  })

  if (!res.ok) throw new Error(`Klaviyo error: ${res.statusText}`)
  return res.json()
}

export async function sendTransactionalEmail(
  toEmail: string,
  templateId: string,
  variables: Record<string, unknown>
) {
  const res = await fetch(`${BASE_URL}/events/`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      revision: '2024-10-15',
      'content-type': 'application/json',
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          profile: { data: { type: 'profile', attributes: { email: toEmail } } },
          metric: { data: { type: 'metric', attributes: { name: templateId } } },
          properties: variables,
        },
      },
    }),
  })

  if (!res.ok) throw new Error(`Klaviyo error: ${res.statusText}`)
  return res.json()
}
