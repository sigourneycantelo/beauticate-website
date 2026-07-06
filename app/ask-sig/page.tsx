import type { Metadata } from 'next'
import AskSigDemo from './AskSigDemo'

export const metadata: Metadata = {
  title: 'Ask Sig | Beauticate',
  description:
    'Chat with Sigourney Cantelo, founder of Beauticate. 25 years of beauty, wellness and style expertise at your fingertips.',
  robots: 'noindex, nofollow',
}

export default function AskSigPage() {
  return <AskSigDemo />
}
