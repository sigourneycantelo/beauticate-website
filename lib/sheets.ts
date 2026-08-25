// Appends leads via a Google Apps Script "Web App" deployment that has access
// to both real destination spreadsheets (see the script pasted into that
// deployment — it hardcodes the two spreadsheet IDs and routes by
// `destination`). No Cloud Console project, no service account, no key file.
const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL

// Neutralise spreadsheet formula/CSV injection. A cell value beginning with
// = + - @ (or a leading tab/CR) is executed as a formula when entered as if
// typed by a human. Prefixing such values with a single quote forces them to
// be treated as literal text.
function neutraliseCell(value: string): string {
  if (typeof value !== 'string' || value.length === 0) return value
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}

// --- Unrelated to the above: generic sheet logging used by chat/query-log/
// reader-question/reviews-submissions. Kept as-is (service-account approach,
// currently unconfigured/dormant same as it's always been) — out of scope
// for the lead-capture work above; not touching it today.
const SHEET_ID = process.env.GOOGLE_SHEET_ID
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) return null

  const now = Math.floor(Date.now() / 1000)
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      iss: CLIENT_EMAIL,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  )

  const { subtle } = globalThis.crypto
  const key = await subtle.importKey(
    'pkcs8',
    pemToBuffer(PRIVATE_KEY),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const sig = await subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(`${header}.${payload}`)
  )
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const jwt = `${header}.${payload}.${signature}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.access_token
}

function pemToBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '')
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export async function appendToSheet(
  sheetName: string,
  row: string[]
): Promise<boolean> {
  if (!SHEET_ID) return false

  const token = await getAccessToken()
  if (!token) return false

  const range = `${sheetName}!A:Z`
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [row.map(neutraliseCell)],
    }),
  })

  return res.ok
}

export type SheetDestination = 'contacts' | 'shop_pipeline'

/**
 * Appends one row to a real, hand-maintained spreadsheet, matched by column
 * header name (not position) so it survives the sheet's columns being
 * reordered. `fields` keys must match that spreadsheet's header text exactly;
 * unmatched headers are left blank, unmatched fields are dropped.
 */
export async function appendLead(
  destination: SheetDestination,
  fields: Record<string, string>
): Promise<boolean> {
  if (!SCRIPT_URL) return false

  const cleaned: Record<string, string> = {}
  for (const [key, value] of Object.entries(fields)) {
    cleaned[key] = neutraliseCell(value)
  }

  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, fields: cleaned }),
    })
    return res.ok
  } catch {
    return false
  }
}
