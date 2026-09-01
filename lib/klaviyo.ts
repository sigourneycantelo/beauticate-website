const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY!
const LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID!
const BASE_URL = 'https://a.klaviyo.com/api'

const HEADERS = {
  accept: 'application/json',
  revision: '2024-10-15',
  'content-type': 'application/json',
  Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
}

/**
 * Create or update a profile with a name and/or custom properties.
 *
 * The `profile-subscription-bulk-create-jobs` endpoint only accepts `email`
 * and `subscriptions` on a profile — `first_name`/`properties` are rejected
 * with a 400. So any name or custom data (partner application fields, etc.)
 * must be written here first, against the `/profiles/` resource.
 */
export async function upsertProfile(
  email: string,
  firstName?: string,
  properties?: Record<string, unknown>
) {
  const hasProperties = !!properties && Object.keys(properties).length > 0
  // Nothing to store beyond the email itself → the subscription call handles it.
  if (!firstName && !hasProperties) return

  const attributes: Record<string, unknown> = { email }
  if (firstName) attributes.first_name = firstName
  if (hasProperties) attributes.properties = properties

  const res = await fetch(`${BASE_URL}/profiles/`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ data: { type: 'profile', attributes } }),
  })

  // Profile already exists → update it in place using the id Klaviyo returns.
  if (res.status === 409) {
    const body = await res.json().catch(() => null)
    const id: string | undefined = body?.errors?.[0]?.meta?.duplicate_profile_id
    if (id) {
      const patch = await fetch(`${BASE_URL}/profiles/${id}/`, {
        method: 'PATCH',
        headers: HEADERS,
        body: JSON.stringify({ data: { type: 'profile', id, attributes } }),
      })
      if (!patch.ok) {
        const detail = await patch.text().catch(() => '')
        throw new Error(`Klaviyo profile update error ${patch.status} ${patch.statusText}: ${detail}`)
      }
    }
    return
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Klaviyo profile error ${res.status} ${res.statusText}: ${detail}`)
  }
}

/** Subscribe an email to a list. `customSource` records where the opt-in came from. */
async function subscribeEmail(listId: string, email: string, customSource?: string) {
  const attributes: Record<string, unknown> = {
    profiles: {
      data: [{
        type: 'profile',
        attributes: {
          email,
          subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
        },
      }],
    },
  }
  if (customSource) attributes.custom_source = customSource

  const res = await fetch(`${BASE_URL}/profile-subscription-bulk-create-jobs/`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes,
        relationships: { list: { data: { type: 'list', id: listId } } },
      },
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Klaviyo subscription error ${res.status} ${res.statusText}: ${detail}`)
  }
  // Returns 202 Accepted with an empty body — nothing to parse.
}

export async function subscribeToList(email: string, firstName?: string) {
  await upsertProfile(email, firstName)
  await subscribeEmail(LIST_ID, email)
  return { success: true }
}

export async function subscribeToListWithProperties(
  listId: string,
  email: string,
  firstName: string,
  properties: Record<string, unknown>
) {
  await upsertProfile(email, firstName, properties)
  const source = typeof properties?.source === 'string' ? properties.source : undefined
  await subscribeEmail(listId, email, source)
  return { success: true }
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

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Klaviyo error ${res.status} ${res.statusText}: ${detail}`)
  }
  return res.json()
}
