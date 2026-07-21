import type { Metadata } from 'next'
import MembersHero from './MembersHero'
import HowItWorks from './HowItWorks'
import Tiers from './Tiers'
import WaysToEarn from './WaysToEarn'
import JoinCTA from './JoinCTA'
import FoundingMemberForm from './FoundingMemberForm'

export const metadata: Metadata = {
  title: "The Members’ Club — Beauticate",
  description:
    "The Beauticate Members’ Club. Shop, earn and unlock access to the inner circle.",
}

export default function MembersPage() {
  return (
    <main>
      <MembersHero />
      <FoundingMemberForm />
      <HowItWorks />
      <Tiers />
      <WaysToEarn />
      <JoinCTA />
    </main>
  )
}
