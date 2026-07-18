'use client'

import { useState, FormEvent } from 'react'

type ActionType = 'tag' | 'follow'

export default function InstagramForm() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [handle, setHandle] = useState('')
  const [actionType, setActionType] = useState<ActionType>('tag')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!firstName || !email || !handle || !file) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('firstName', firstName)
      formData.append('email', email)
      formData.append('handle', handle)
      formData.append('actionType', actionType)
      formData.append('screenshot', file)

      const res = await fetch('/api/members/instagram', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Submission failed')
      }

      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <p className="font-serif italic text-lg opacity-80">
          Got it. We&rsquo;ll check and add your points within the week.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First name"
          className="font-sans text-[13px] px-4 py-3 bg-white border border-ink/20 outline-none"
        />
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Account email (must match your shop account)"
          className="font-sans text-[13px] px-4 py-3 bg-white border border-ink/20 outline-none"
        />
        <input
          type="text"
          required
          value={handle}
          onChange={e => setHandle(e.target.value)}
          placeholder="Instagram handle (e.g. @yourname)"
          className="font-sans text-[13px] px-4 py-3 bg-white border border-ink/20 outline-none"
        />

        <fieldset className="border border-ink/10 p-4">
          <legend className="font-sans text-[11px] tracking-[0.2em] uppercase opacity-50 px-2">
            What did you do?
          </legend>
          <div className="flex gap-6 mt-1">
            <label className="flex items-center gap-2 font-sans text-[13px] cursor-pointer">
              <input
                type="radio"
                name="actionType"
                value="tag"
                checked={actionType === 'tag'}
                onChange={() => setActionType('tag')}
                className="accent-ink"
              />
              Tagged Beauticate
            </label>
            <label className="flex items-center gap-2 font-sans text-[13px] cursor-pointer">
              <input
                type="radio"
                name="actionType"
                value="follow"
                checked={actionType === 'follow'}
                onChange={() => setActionType('follow')}
                className="accent-ink"
              />
              Followed Beauticate
            </label>
          </div>
        </fieldset>

        <div>
          <label className="block font-sans text-[11px] tracking-[0.2em] uppercase opacity-50 mb-2">
            Screenshot proof
          </label>
          <input
            type="file"
            required
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="font-sans text-[13px] file:mr-3 file:px-4 file:py-2 file:border file:border-ink/20 file:bg-parchment file:font-sans file:text-[11px] file:tracking-[0.15em] file:uppercase file:cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary mt-2 disabled:opacity-50"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </div>

      {status === 'error' && (
        <p className="font-sans text-[12px] mt-3 text-wine">
          {errorMsg}
        </p>
      )}
    </form>
  )
}
