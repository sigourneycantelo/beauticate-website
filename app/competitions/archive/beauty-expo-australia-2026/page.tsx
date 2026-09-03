import type { Metadata } from 'next'
import Link from 'next/link'

/* ══════════════════════════════════════════════════════════════════════════
   ARCHIVED COMPETITION — frozen record. This is a snapshot of the terms
   exactly as they stood while the Beauticate x Beauty Expo Australia 2026
   Giveaway was running. Do not edit it to reflect later policy changes: its
   whole purpose is to record what entrants actually agreed to at the time.
   ══════════════════════════════════════════════════════════════════════════ */
const comp = {
  name: 'Beauticate x Beauty Expo Australia 2026 Giveaway',
  lastUpdated: 'July 2026',
  entryOpen: '9 July 2026',
  entryClose: '11:59pm AEST on 31 July 2026',
  drawDate: '3 August 2026',
  entryMethod:
    'Comment on the nominated Beauticate Instagram post or reel, or reply to the nominated story, then provide a valid email address when prompted by direct message',
  prize:
    'Two passes to Beauty Expo Australia 2026 (15–16 August 2026, ICC Sydney), each including a goodie bag upgrade',
  prizeValue: 'A$80 minimum (excluding goodie bag contents)',
}

export const metadata: Metadata = {
  title: `${comp.name} Terms & Conditions | Beauticate`,
  description:
    'Archived terms and conditions for the Beauticate x Beauty Expo Australia 2026 Giveaway, which closed on 31 July 2026.',
  robots: { index: false, follow: true },
}

export default function BeautyExpo2026TermsPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Legal · Archived</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">
          {comp.name}
        </h1>
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mt-3">
          Closed {comp.entryClose} · Drawn {comp.drawDate}
        </p>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <p className="rounded-lg bg-tile/60 border border-camel/30 p-5 text-[15px]">
          This competition has closed. These are the terms that applied to it,
          kept here as a record. For the competition currently running, see our{' '}
          <Link href="/competitions/terms" className="text-ink hover:text-eucalypt transition-colors">
            current competition terms
          </Link>.
        </p>

        <p>
          These terms had two parts. <strong className="font-normal text-ink">This competition</strong>{' '}
          covered the specific details of the giveaway.{' '}
          <strong className="font-normal text-ink">General terms</strong> apply to
          every Beauticate competition. By entering, entrants accepted both, together with
          our{' '}
          <a href="/privacy" className="text-ink hover:text-eucalypt transition-colors">Privacy Policy</a>{' '}
          and{' '}
          <a href="/terms" className="text-ink hover:text-eucalypt transition-colors">Terms &amp; Conditions</a>.
        </p>

        {/* ══════════════════════════════════════════════════════════════════
            PART ONE — THIS COMPETITION (as it ran)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="pt-4 border-t border-camel/30">
          <p className="label-editorial mb-2">Part one</p>
          <h2 className="font-serif text-2xl text-ink">This competition</h2>
          <p className="text-sm text-charcoal/50 mt-1">
            The details specific to this giveaway.
          </p>
        </div>

        {/* The competition at a glance (reads from `comp`) */}
        <section className="rounded-lg bg-tile/60 border border-camel/30 p-6 md:p-8">
          <h3 className="font-serif text-xl text-ink mb-4">
            {comp.name}{' '}
            <span className="text-charcoal/40 font-normal">(closed)</span>
          </h3>
          <dl className="space-y-3 text-[15px]">
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Prize</dt>
              <dd>{comp.prize}</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Total prize value</dt>
              <dd>{comp.prizeValue}</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Entry period</dt>
              <dd>Opened {comp.entryOpen}, closed {comp.entryClose}</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Draw</dt>
              <dd>Drawn at random {comp.drawDate} (game of chance)</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">How to enter</dt>
              <dd>{comp.entryMethod}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Who can enter</h3>
          <p>
            Entry is open to Australian residents aged 18 years and over who are
            qualified beauty industry professionals. This includes registered
            nurses, beauty therapists, dermal clinicians, salon and clinic
            owners, and other industry practitioners.
          </p>
          <p className="mt-4">
            Beauty Expo Australia is a trade-only event. Entrants who are not
            qualified professionals are not eligible to attend and therefore not
            eligible to win.
          </p>
          <p className="mt-4">
            Employees of the Promoter and of Beauty Expo Australia, and their
            immediate families, are not eligible to enter.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Entry period</h3>
          <p>
            The promotion opened on {comp.entryOpen} and closed at {comp.entryClose}.
          </p>
          <p className="mt-4">Entries received outside this period will not be accepted.</p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">How to enter</h3>
          <p>
            Entry is free. To enter, entrants comment on the nominated Beauticate
            Instagram post or reel, or reply to the nominated Beauticate
            Instagram story, and then provide a valid email address when prompted
            in the resulting direct message conversation.
          </p>
          <p className="mt-4">
            An entry is only valid once a valid email address has been submitted.
          </p>
          <p className="mt-4">
            One entry per person. The Promoter reserves the right to disqualify
            duplicate entries.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">The prize</h3>
          <p>
            There is one prize consisting of two passes to Beauty Expo Australia
            2026, held on 15 and 16 August 2026 at ICC Sydney, each including a
            goodie bag upgrade. Expo passes are valued at A$40 each. The value of
            the goodie bag is indeterminate. Total minimum prize value is A$80
            excluding goodie bag contents.
          </p>
          <p className="mt-4">
            The prize is not transferable, not exchangeable, and cannot be
            redeemed for cash. The prize does not include travel, accommodation,
            parking, meals or any other cost associated with attending the event.
            All such costs are the responsibility of the winner.
          </p>
          <p className="mt-4">
            If the prize becomes unavailable for reasons beyond the Promoter&apos;s
            control, the Promoter reserves the right to substitute a prize of
            equal or greater value, subject to any written directions from a
            relevant regulatory authority.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">How the winner is chosen</h3>
          <p>
            This is a game of chance. Skill plays no part in determining the
            winner.
          </p>
          <p className="mt-4">
            The winner will be drawn at random from all valid entries on {comp.drawDate},
            using a random number generator. The draw will be conducted
            electronically and no physical draw location applies.
          </p>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PART TWO — GENERAL TERMS (standing — apply to every competition)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="pt-6 border-t border-camel/30">
          <p className="label-editorial mb-2">Part two</p>
          <h2 className="font-serif text-2xl text-ink">General terms</h2>
          <p className="text-sm text-charcoal/50 mt-1">
            These apply to every Beauticate competition.
          </p>
        </div>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">The promoter</h3>
          <p>
            This promotion is conducted by Cantelo Corporation Pty Ltd trading as
            Beauticate (&ldquo;the Promoter&rdquo;). Enquiries can be directed to{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Notifying the winner</h3>
          <p>
            The winner will be notified by email and by Instagram direct message
            within two business days of the draw.
          </p>
          <p className="mt-4">
            The winner&apos;s first name and general location may be announced on
            Beauticate&apos;s Instagram account and in the Beauticate newsletter.
          </p>
          <p className="mt-4">
            The winner must respond to confirm acceptance within 7 days of
            notification. If the winner cannot be contacted, does not respond
            within that period, or is found to be ineligible, the Promoter
            reserves the right to redraw. Any redraw will be conducted
            electronically by the same method within 5 business days, and the
            redrawn winner will be notified within two business days.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Personal information</h3>
          <p>
            By entering, entrants consent to receiving marketing communications
            from Beauticate, including the Beauticate newsletter. Entrants may
            unsubscribe at any time using the link in any email.
          </p>
          <p className="mt-4">
            Personal information collected will be handled in accordance with the
            Beauticate{' '}
            <a href="/privacy" className="text-ink hover:text-eucalypt transition-colors">privacy policy</a>.
            The Promoter will not sell entrants&apos; personal information.
          </p>
          <p className="mt-4">
            Entrants&apos; email addresses are stored in the Promoter&apos;s email
            platform for the purpose of administering this promotion and sending
            marketing communications.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">General</h3>
          <p>
            The Promoter&apos;s decision is final and no correspondence will be
            entered into.
          </p>
          <p className="mt-4">
            The Promoter reserves the right to verify the validity of any entry
            and to disqualify any entrant who tampers with the entry process,
            submits an entry that is not in accordance with these terms, or
            engages in conduct that is fraudulent, misleading or damaging to the
            goodwill of the Promoter.
          </p>
          <p className="mt-4">
            The Promoter is not responsible for entries that are lost, delayed or
            not received for any reason.
          </p>
          <p className="mt-4">
            Nothing in these terms limits, excludes or modifies any rights
            entrants have under the Australian Consumer Law.
          </p>
          <p className="mt-4">
            By entering, entrants agree to be bound by these terms and conditions.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Instagram and Meta</h3>
          <p>
            This promotion is in no way sponsored, endorsed, administered by, or
            associated with Meta Platforms, Inc. or Instagram. Entrants release
            Meta and Instagram completely in relation to this promotion. Any
            questions, comments or complaints about the promotion must be
            directed to the Promoter, not to Meta or Instagram.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Governing law</h3>
          <p>These terms are governed by the laws of New South Wales, Australia.</p>
        </section>

        <p className="pt-6 border-t border-camel/20">
          <Link href="/competitions/archive" className="text-ink hover:text-eucalypt transition-colors">
            ← All past competitions
          </Link>
        </p>

        <p className="text-xs text-charcoal/40 font-sans pt-6 border-t border-camel/20">
          Cantelo Corporation Pty Ltd · ABN 71 105 175 317
        </p>
      </div>
    </div>
  )
}
