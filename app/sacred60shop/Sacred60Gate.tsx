'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Sacred60Gate({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false)
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    if (params.get('access') === 'true') {
      localStorage.setItem('sacred60_access', '1')
      setAllowed(true)
      return
    }
    if (localStorage.getItem('sacred60_access') === '1') {
      setAllowed(true)
      return
    }
    router.replace('/sacred60')
  }, [params, router])

  if (!allowed) return null
  return <>{children}</>
}
