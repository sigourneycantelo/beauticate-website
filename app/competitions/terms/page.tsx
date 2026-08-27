import type { Metadata } from 'next'
import Link from 'next/link'
import { pastCompetitions } from '../pastCompetitions'

/* ══════════════════════════════════════════════════════════════════════════
   ⚠ OPEN ITEMS — RESOLVE BEFORE THIS PROMOTION GOES LIVE
   ─────────────────────────────────────────────────────────────────────────
   1. TRADE PROMOTION PERMITS. Total prize pool is A$1,050. Confirm the
      current permit thresholds and lodgement requirements for SA, ACT and
      NSW before the entry period opens. NOT RESOLVED — needs legal sign-off,
      not a desk assumption. If a permit is granted, its number must be added
      to `permitNumbers` below and will render in the summary box.
   2. PROMOTER STREET ADDRESS. `promoterAddress` currently carries locality
      only. House policy (legal-copy/0-BRIEF-for-claude-code.md) is that no
      street address appears anywhere on the site — but permit conditions
      generally require the Promoter's full business address in the terms.
      Sig to supply if a permit is required; the two rules conflict and legal
      decides which wins.
   3. PRIZE VALUE — THE PROSE BELOW IS PROBABLY WRONG. UNRESOLVED.
      The brief said "three winners, each winner and their two tagged friends
      receive one Skin Food pack, total pack value $350 each, total prize pool
      $1,050". Those three figures cannot all be true at once:
        (a) 3 winners x 3 people x A$350/pack        = A$3,150  ✗ not A$1,050
        (b) 3 prizes of 3 packs, A$350 per PRIZE     = A$1,050  ✓ arithmetic
        (c) 3 packs, one per winner, A$350 per PACK  = A$1,050  ✓ arithmetic
      The page currently states (b). Retail pricing points at (c) instead:
      the full Skin Food range in the campaign artwork (13 items, 11 distinct
      products) comes to roughly A$340-375 at Australian RRP — i.e. ONE full
      range pack is worth about A$350 on its own, which makes "A$350 per pack"
      far more likely than "A$350 for three packs" (that would be ~A$117 each).
      If (c) is right, only the three winners receive a pack and the tagged
      friends do not — which contradicts the brief's own description of who
      gets what. Get Weleda to confirm both the pack value AND whether the
      tagged friends receive one, then rewrite "The prize" section and
      `prize` / `prizeValue` to match. Do not publish on the current wording.
   4. PACK CONTENTS. Confirm the final Skin Food pack line-up with Weleda and
      write it into `prize` — "pack" alone is too vague to be a prize
      description under the ACL.
   5. WELEDA LEGAL ENTITY. "Weleda Australia" is the trading name used here.
      Confirm the registered entity name for the ineligibility and prize
      partner clauses.
   ══════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════
   PART ONE — “This competition”. The variable facts. Update this object each
   time a new competition runs; the summary box and the Part One prose both read
   from it, so dates/prize/draw only change in one place. Everything in Part Two
   (“General terms”) is identical every competition and rarely changes.
   ══════════════════════════════════════════════════════════════════════════ */
const comp = {
  name: '100 Years of Skin Food Giveaway',
  status: 'open' as 'open' | 'closed',
  lastUpdated: 'August 2026',
  entryOpen: '27 August 2026',
  entryClose: '11:59pm AEST on 10 September 2026',
  drawBy: '17 September 2026',
  partner: 'Weleda Australia',
  entryMethod:
    'Follow @beauticate and @weledaaustralia on Instagram, tag two friends in the comments of the competition post, and comment the word ICON. One bonus entry for sharing the post to your Instagram story',
  prize:
    'Three prizes. Each prize is three Weleda Skin Food packs — one for the winner and one for each of the two friends they tagged',
  prizeValue: 'A$350 per prize · A$1,050 total prize pool',
  /** Locality only — see open item 2 above. */
  promoterAddress: 'Sydney, New South Wales, Australia',
  /** Add permit numbers here once granted, e.g. ['NSW: TP/00000', 'SA: T00/000']. */
  permitNumbers: [] as string[],
}

export const metadata: Metadata = {
  title: `${comp.name} Terms & Conditions | Beauticate`,
  description:
    'Terms and conditions for competitions, prize draws and giveaways run by Beauticate.',
}

export default function CompetitionTermsPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-14 md:py-20">

      <header className="mb-10 border-b border-camel/30 pb-8">
        <p className="label-editorial mb-2">Legal</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink">
          Competition Terms &amp; Conditions
        </h1>
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mt-3">
          Last updated: {comp.lastUpdated}
        </p>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <p>
          These terms have two parts. <strong className="font-normal text-ink">This competition</strong>{' '}
          covers the specific details of the giveaway currently running.{' '}
          <strong className="font-normal text-ink">General terms</strong> apply to
          every Beauticate competition. By entering you accept both, together with
          our{' '}
          <a href="/privacy" className="text-ink hover:text-eucalypt transition-colors">Privacy Policy</a>{' '}
          and{' '}
          <a href="/terms" className="text-ink hover:text-eucalypt transition-colors">Terms &amp; Conditions</a>.
        </p>

        {/* ══════════════════════════════════════════════════════════════════
            PART ONE — THIS COMPETITION (edit per competition)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="pt-4 border-t border-camel/30">
          <p className="label-editorial mb-2">Part one</p>
          <h2 className="font-serif text-2xl text-ink">This competition</h2>
          <p className="text-sm text-charcoal/50 mt-1">
            The details specific to the giveaway currently running.
          </p>
        </div>

        {/* Current competition at a glance (reads from `comp`) */}
        <section className="rounded-lg bg-tile/60 border border-camel/30 p-6 md:p-8">
          <h3 className="font-serif text-xl text-ink mb-4">
            {comp.name}{' '}
            <span className="text-charcoal/40 font-normal">
              {comp.status === 'open' ? '(now open)' : '(closed)'}
            </span>
          </h3>
          <dl className="space-y-3 text-[15px]">
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Promoter</dt>
              <dd>Beauticate, in partnership with {comp.partner}</dd>
            </div>
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
              <dd>Opens {comp.entryOpen}, closes {comp.entryClose}</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Draw</dt>
              <dd>Drawn at random on or before {comp.drawBy} (game of chance)</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">How to enter</dt>
              <dd>{comp.entryMethod}</dd>
            </div>
            {comp.permitNumbers.length > 0 && (
              <div>
                <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Permits</dt>
                <dd>{comp.permitNumbers.join(' · ')}</dd>
              </div>
            )}
          </dl>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Who can enter</h3>
          <p>
            Entry is open to residents of Australia aged 18 years and over at
            the time of entry.
          </p>
          <p className="mt-4">
            Entrants must have an Instagram account, and that account must be
            public or otherwise accessible to the Promoter, so that a winning
            entry can be verified and the winner contacted. If an account
            cannot be viewed or messaged by the Promoter, the entry cannot be
            verified and is not eligible.
          </p>
          <p className="mt-4">
            Employees, contractors and the immediate families of the Promoter
            and of {comp.partner} are not eligible to enter.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Entry period</h3>
          <p>
            The promotion opens on {comp.entryOpen}, being the date the
            competition post is published, and closes at {comp.entryClose}.
          </p>
          <p className="mt-4">Entries received outside this period will not be accepted.</p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">How to enter</h3>
          <p>Entry is free. To enter, complete all three steps:</p>
          <ol className="mt-4 space-y-2 list-decimal pl-5 marker:text-charcoal/40">
            <li>
              Follow both{' '}
              <a
                href="https://www.instagram.com/beauticate/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-eucalypt transition-colors"
              >
                @beauticate
              </a>{' '}
              and{' '}
              <a
                href="https://www.instagram.com/weledaaustralia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-eucalypt transition-colors"
              >
                @weledaaustralia
              </a>{' '}
              on Instagram.
            </li>
            <li>
              Tag two friends in the comments of the competition post — friends
              you think need a skin rescue.
            </li>
            <li>Comment the word ICON on the competition post.</li>
          </ol>
          <p className="mt-4">
            An entry is only valid once all three steps have been completed. The
            two tagged friends must be separate Instagram accounts, and must not
            be the entrant&apos;s own account.
          </p>
          <p className="mt-4">
            <strong className="font-normal text-ink">Bonus entry.</strong>{' '}
            Entrants who also share the competition post to their Instagram
            story, tagging @beauticate so the share is visible to the Promoter,
            receive one additional entry in the draw.
          </p>
          <p className="mt-4">
            One entry per person, plus a maximum of one bonus entry — so no
            entrant may hold more than two entries. Commenting more than once
            does not create additional entries.
          </p>
          <p className="mt-4">
            Entries must not be automated, generated in bulk, or submitted
            through any account created for the purpose of entering.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">The prize</h3>
          <p>
            There are three prizes. Each prize consists of three Weleda Skin
            Food packs: one for the winner, and one for each of the two friends
            that winner tagged in their entry. Each prize is valued at A$350,
            giving a total prize pool of A$1,050.
          </p>
          <p className="mt-4">
            Prizes are awarded to the winner. It is a condition of the prize
            that the two remaining packs go to the two friends named in the
            winning entry. If either tagged friend is not contactable, is not a
            resident of Australia, is under 18, or declines the prize, the
            Promoter may award the remaining pack to the winner or withhold it,
            at the Promoter&apos;s discretion.
          </p>
          <p className="mt-4">
            Prizes are not transferable, not exchangeable, and cannot be
            redeemed for cash. Prizes are delivered to an Australian postal
            address only.
          </p>
          <p className="mt-4">
            If a prize becomes unavailable for reasons beyond the
            Promoter&apos;s control, the Promoter reserves the right to
            substitute a prize of equal or greater value, subject to any written
            directions from a relevant regulatory authority.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">How the winners are chosen</h3>
          <p>
            This is a game of chance. Skill plays no part in determining the
            winners.
          </p>
          <p className="mt-4">
            Three winners will be drawn at random from all valid entries within
            7 days of the entry period closing, being on or before{' '}
            {comp.drawBy}, using a random number generator. The draw will be
            conducted electronically and no physical draw location applies.
          </p>
          <p className="mt-4">
            Winners will be notified by Instagram direct message. A winner must
            respond within 48 hours of that message being sent. If a winner does
            not respond within 48 hours, cannot be contacted, or is found to be
            ineligible, that winner&apos;s entry is forfeited and a new winner
            will be drawn by the same method.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">
            Your email address and what we do with it
          </h3>
          <p>
            To arrange delivery of a prize, the Promoter may ask an entrant for
            their email address and a postal address by Instagram direct
            message. Giving them is voluntary, but the Promoter cannot send a
            prize without them.
          </p>
          <p className="mt-4">
            If you give us your email address, we will use it to run this
            promotion and send you your prize —{' '}
            <strong className="font-normal text-ink">
              and we will also add you to the Beauticate mailing list
            </strong>
            , which is our newsletter. You can unsubscribe at any time using the
            link at the bottom of any email we send you, and we will stop. Your
            entry in this promotion does not depend on staying subscribed.
          </p>
          <p className="mt-4">
            Where a prize is being sent to a tagged friend, we will ask that
            person for their own details directly, and the same applies to them.
          </p>
          <p className="mt-4">
            Delivery details are shared with {comp.partner} only for the purpose
            of fulfilling the prize. We handle personal information in
            accordance with the Australian Privacy Principles and our{' '}
            <a href="/privacy" className="text-ink hover:text-eucalypt transition-colors">privacy policy</a>,
            and we do not sell it.
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
            This promotion is conducted by Cantelo Corporation Pty Ltd (ABN 71
            105 175 317), trading as Beauticate, of {comp.promoterAddress}{' '}
            (&ldquo;the Promoter&rdquo;). Enquiries can be directed to{' '}
            <a href="mailto:hello@beauticate.com" className="text-ink hover:text-eucalypt transition-colors">
              hello@beauticate.com
            </a>.
          </p>
          <p className="mt-4">
            {comp.partner} is the prize partner for this promotion and supplies
            the prizes. {comp.partner} is not the Promoter, and questions about
            the promotion should be directed to the Promoter.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Notifying the winner</h3>
          <p>
            Winners are notified by Instagram direct message, and by email where
            an email address has been provided, within two business days of the
            draw.
          </p>
          <p className="mt-4">
            A winner&apos;s Instagram handle, first name and general location
            may be announced on Beauticate&apos;s Instagram account and in the
            Beauticate newsletter.
          </p>
          <p className="mt-4">
            Where a winner does not respond within the period stated in Part
            One, cannot be contacted, or is found to be ineligible, the Promoter
            reserves the right to redraw. Any redraw will be conducted
            electronically by the same method within 5 business days, and the
            redrawn winner will be notified within two business days.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">Personal information</h3>
          <p>
            Personal information collected will be handled in accordance with
            the Australian Privacy Principles and the Beauticate{' '}
            <a href="/privacy" className="text-ink hover:text-eucalypt transition-colors">privacy policy</a>.
            The Promoter will not sell entrants&apos; personal information.
          </p>
          <p className="mt-4">
            Entrants&apos; email addresses are stored in the Promoter&apos;s
            email platform for the purpose of administering the promotion and
            sending marketing communications. Entrants may unsubscribe at any
            time using the link in any email.
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
            The Promoter reserves the right to amend, suspend or cancel the
            promotion if it cannot be run as planned because of circumstances
            outside the Promoter&apos;s reasonable control, including technical
            failure, unauthorised intervention, or the prize becoming
            unavailable. Any such change is subject to any written directions
            from a relevant regulatory authority.
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

        {pastCompetitions.length > 0 && (
          <p className="pt-6 border-t border-camel/20">
            <Link href="/competitions/archive" className="text-ink hover:text-eucalypt transition-colors">
              Past competitions →
            </Link>
          </p>
        )}

        <p className="text-xs text-charcoal/40 font-sans pt-6 border-t border-camel/20">
          Cantelo Corporation Pty Ltd · ABN 71 105 175 317
        </p>
      </div>
    </div>
  )
}
