import AccountDashboard from '@/components/loyalty/AccountDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Account' }

export default function AccountPage() {
  return <AccountDashboard />
}
