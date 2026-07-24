import { NextRequest, NextResponse } from 'next/server'

const EARLY_ACCESS_PASSWORD = process.env.EARLY_ACCESS_PASSWORD ?? 'Early2026'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== EARLY_ACCESS_PASSWORD) {
    return NextResponse.json({ error: 'wrong' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('early_access', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
