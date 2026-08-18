// Appends rows via a Google Apps Script "Web App" deployment attached to the
// target spreadsheet, rather than the Sheets API + service account. Far less
// setup: no Cloud Console project, no service account, no PEM key handling —
// just a script pasted into the sheet itself and a deploy URL pasted here.
const SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL

// Neutralise spreadsheet formula/CSV injection. A cell value beginning with
// = + - @ (or a leading tab/CR) is executed as a formula when entered as if
// typed by a human. Prefixing such values with a single quote forces them to
// be treated as literal text. Applied to every cell so all callers are covered.
function neutraliseCell(value: string): string {
  if (typeof value !== 'string' || value.length === 0) return value
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}

export async function appendToSheet(
  sheetName: string,
  row: string[]
): Promise<boolean> {
  if (!SCRIPT_URL) return false

  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sheetName,
        values: row.map(neutraliseCell),
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
