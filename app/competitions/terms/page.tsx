import type { Metadata } from 'next'
import Link from 'next/link'
import { pastCompetitions } from '../pastCompetitions'

/* ══════════════════════════════════════════════════════════════════════════
   STATUS — this promotion is LIVE from 1 October 2026. Entry closes 11:59pm
   AEDT on 31 October 2026. Judging 1–5 November 2026.

   The competition sits ABOVE the gift with purchase on this page, because
   almost everyone who lands here arrives from the competition post.

   `status` is no longer hand-set. `compIsOpen` derives it from
   `comp.entryCloseISO` and the page revalidates hourly, so a closed
   competition stops advertising itself as open without anyone deploying. That
   is the bug this page actually had: the Weleda competition closed on 10
   September and was still rendering "now open" three weeks later.
   ──────────────────────────────────────────────────────────────────────
   STILL OPEN
   1. ESCAPE HAVEN LEGAL ENTITY. "Escape Haven" is the trading name used here.
      Confirm the registered entity for the ineligibility and prize partner
      clauses, the same open item the Weleda competition carried.

   SETTLED — kept because the reasoning is what the next competition needs
   • TRADE PROMOTION PERMITS — none required, BUT only because this is a game
     of SKILL. Confirmed by Sig, 1 October 2026.
     The thresholds recorded during the Weleda competition (ACT over A$3,000;
     SA over A$5,000 or ANY instant-win; NT over A$5,000; NSW over A$10,000)
     are for trade promotion LOTTERIES, meaning games of CHANCE. Weleda's
     A$1,050 pool sat under all of them, so the question never had to be
     answered properly. This prize is A$4,200, which is OVER the ACT
     threshold. What keeps it outside the permit schemes is not the value, it
     is that entries are judged on the answer given and chance plays no part.
     So the skill framing is load bearing, not cosmetic. It has to hold in
     practice as well as on the page: a real judging criterion, real judges,
     judging dates that are kept, and a winner chosen on the merit of the
     answer. If the mechanic is ever softened back towards a random draw at
     this prize value, a permit IS required and its number must be printed in
     the terms via `permitNumbers`. Do not copy "no permit needed" forward
     without re-checking which kind of competition it is.
   • WORLDWIDE ENTRY — the first on this site. Every previous Beauticate
     competition was open to Australian residents only. Three things follow,
     all handled below: entrants where the promotion is prohibited (the
     "except where prohibited by law" carve-out), entrant data going to a
     prize partner in Indonesia (disclosed under "Your email address and what
     we do with it"), and a winner arranging their own passport, visa and
     flights (stated under "The prize"). Part Two still invokes the Australian
     Privacy Principles and the Australian Consumer Law, which is correct:
     those bind the Promoter wherever the entrant lives.
   • PROMOTER STREET ADDRESS — locality only, per the house rule in
     legal-copy/0-BRIEF-for-claude-code.md. Unchanged.
   ══════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════
   PART ONE — “This competition”. The variable facts. Update this object each
   time a new competition runs; the summary box and the Part One prose both read
   from it, so dates/prize/draw only change in one place. Everything in Part Two
   (“General terms”) is identical every competition and rarely changes.
   ══════════════════════════════════════════════════════════════════════════ */
const comp = {
  name: 'Escape Haven Giveaway',
  /**
   * The moment entry closes, as a real timestamp. `status` is DERIVED from
   * this, not hand-set, because a hand-set flag is exactly what left the
   * Weleda competition rendering as "now open" for three weeks after it had
   * closed. AEDT is UTC+11.
   */
  entryCloseISO: '2026-10-31T23:59:59+11:00',
  lastUpdated: 'October 2026',
  entryOpen: '1 October 2026',
  entryClose: '11:59pm AEDT on 31 October 2026',
  drawBy: '5 November 2026',
  partner: 'Escape Haven',
  /** The Instagram post entries are made on. Entry happens there, so the terms link to it. */
  entryPostUrl: 'https://www.instagram.com/p/Dd81W89y7Cb/',
  entryMethod:
    'Follow @beauticate, @sigourneycantelo and @escapehaven on Instagram, comment the word ESCAPE on the competition post together with your answer to why you need this escape, and tag two friends in the comments. We then ask for your email address so we can contact you if you win',
  prize:
    'One 6-night Escape Essentials Retreat for one woman at Escape Haven, Canggu, Bali, in a private Heritage Room',
  prizeValue: 'A$4,200',
  /** Locality only — the house rule in legal-copy/0-BRIEF-for-claude-code.md. */
  promoterAddress: 'Sydney, New South Wales, Australia',
  /**
   * Empty because this is a game of skill, which sits outside the trade
   * promotion lottery permit schemes. See the STATUS block: at A$4,200 this
   * is over the ACT chance threshold, so if the mechanic ever becomes a
   * random draw a permit is required and its number belongs here.
   */
  permitNumbers: [] as string[],
  /** 'skill' or 'chance'. Drives the summary box and the winner section. */
  winnerChosenBy: 'skill' as 'skill' | 'chance',
  judgingWindow: '1 and 5 November 2026',
}

/* ══════════════════════════════════════════════════════════════════════════
   THE RUNNING GIFT WITH PURCHASE. Newest promotion sits at the top of this
   page, above the competition; when it finishes it moves to the past list the
   same way competitions do.

   A gift with purchase is NOT a trade promotion: there is no element of chance,
   no draw and no prize, so none of the permit thresholds in the block above
   apply to it however large the total value gets. It is a conditional discount
   on a purchase, which is why the terms below are about spend, stock and
   substitution rather than entry and eligibility.
   ══════════════════════════════════════════════════════════════════════════ */
const gwp = {
  brand: 'BOOIE Beauty',
  status: 'open' as 'open' | 'closed',
  gift: 'Bloody Delicious Hydrating Tinted Illuminator in Champagne',
  giftValue: 'A$39',
  minSpend: 'A$45',
  started: '9 September 2026',
}

/**
 * Re-rendered hourly so a competition closes on time without anyone deploying.
 * Without this the page is static and `isOpen` would freeze at whatever it was
 * when the site was last built.
 */
export const revalidate = 3600

/** True until the close timestamp passes. Never hand-set. */
const compIsOpen = Date.now() < Date.parse(comp.entryCloseISO)

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
          Competition &amp; Promotion Terms
        </h1>
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mt-3">
          Last updated: {comp.lastUpdated}
        </p>
      </header>

      <div className="font-serif text-charcoal/80 leading-relaxed space-y-8">

        <p>
          This page covers the promotions Beauticate is running now, the competition
          first and then a gift with purchase, followed by the general terms that
          apply to every competition we run.{' '}
          <strong className="font-normal text-ink">This competition</strong>{' '}
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
              {compIsOpen ? '(now open)' : '(now closed)'}
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
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Prize value</dt>
              <dd>{comp.prizeValue}</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Entry period</dt>
              <dd>Opens {comp.entryOpen}, closes {comp.entryClose}</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">
                {comp.winnerChosenBy === 'skill' ? 'Judging' : 'Draw'}
              </dt>
              <dd>
                {comp.winnerChosenBy === 'skill'
                  ? `One winner, judged on the merit of their answer between ${comp.judgingWindow} (game of skill)`
                  : `One winner, drawn at random on or before ${comp.drawBy} (game of chance)`}
              </dd>
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
            Entry is open worldwide to anyone aged 18 years and over at the time
            of entry, except where entry is prohibited by the law of the place
            the entrant lives.
          </p>
          <p className="mt-4">
            Entrants must have an Instagram account, and that account must be
            public or otherwise accessible to the Promoter, so that a winning
            entry can be verified. If an account cannot be viewed or messaged by
            the Promoter, the entry cannot be verified and is not eligible.
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
              Follow{' '}
              <a href="https://www.instagram.com/beauticate/" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-eucalypt transition-colors">@beauticate</a>,{' '}
              <a href="https://www.instagram.com/sigourneycantelo/" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-eucalypt transition-colors">@sigourneycantelo</a>{' '}
              and{' '}
              <a href="https://www.instagram.com/escapehaven/" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-eucalypt transition-colors">@escapehaven</a>{' '}
              on Instagram.
            </li>
            <li>
              Comment the word ESCAPE on{' '}
              <a href={comp.entryPostUrl} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-eucalypt transition-colors">the competition post</a>, together with
              your answer to why you need this escape. The answer is what the
              judges read, so it is the part that decides the winner.
            </li>
            <li>
              Tag two friends in the comments who need it too.
            </li>
          </ol>
          <p className="mt-4">
            An entry is only valid once all three steps have been completed. The
            two tagged friends must be separate Instagram accounts, and must not
            be the entrant&apos;s own account. Entrants must also provide a valid
            email address when prompted.
          </p>
          <p className="mt-4">
            Sharing the post to an Instagram story is welcome but entirely
            optional. It earns no additional entry and has no bearing on
            judging.
          </p>
          <p className="mt-4">
            One entry per person. Commenting more than once does not create
            additional entries, and where someone enters more than once only
            their first entry is judged.
          </p>
          <p className="mt-4">
            Entries must not be automated, generated in bulk, or submitted
            through any account created for the purpose of entering.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">The prize</h3>
          <p>
            There is one prize: a 6-night Escape Essentials Retreat for one
            woman at Escape Haven in Canggu, Bali, staying in a private Heritage
            Room. The total prize value is A$4,200.
          </p>
          <p className="mt-4">The prize includes:</p>
          <ul className="mt-3 space-y-1 list-disc pl-5 marker:text-charcoal/40">
            <li>Six nights&apos; private accommodation in a Heritage Room</li>
            <li>The Escape Essentials retreat package</li>
            <li>All nourishing meals, snacks and non-alcoholic drinks</li>
            <li>The spa and wellness treatments included in that package</li>
            <li>
              18 signature wellness experiences, including Pilates, yoga,
              breathwork, meditation, floating sound healing, wellness
              workshops, cooking lessons, cultural ceremonies and the sunset
              beach cacao ceremony
            </li>
            <li>Bali airport transfers</li>
          </ul>
          <p className="mt-4">
            <strong className="font-normal text-ink">The prize does not include flights.</strong>{' '}
            Travel to and from Bali, travel insurance, and any treatments,
            activities or purchases outside the Escape Essentials package are
            the winner&apos;s own responsibility and at the winner&apos;s own
            cost.
          </p>
          <p className="mt-4">
            The winner is responsible for their own passport, visa and any other
            requirement for entry to Indonesia, and for arranging their own
            travel. The Promoter and {comp.partner} are not responsible for a
            winner who cannot travel, and no alternative prize or compensation is
            offered in that event.
          </p>
          <p className="mt-4">
            The retreat must be taken within 12 months of the winner being
            notified. It is redeemable on selected Escape Haven retreat dates and
            is subject to availability. {comp.partner} will give the winner a
            choice of eligible dates and work with her to find one that suits.
          </p>
          <p className="mt-4">
            The prize is for one woman. Escape Haven is a women-only retreat, so
            the prize cannot be taken by a man, and this is a condition of the
            prize partner rather than of the Promoter.
          </p>
          <p className="mt-4">
            The prize is not transferable, not exchangeable, and cannot be
            redeemed for cash.
          </p>
          <p className="mt-4">
            If the prize becomes unavailable for reasons beyond the
            Promoter&apos;s control, the Promoter reserves the right to
            substitute a prize of equal or greater value, subject to any written
            directions from a relevant regulatory authority.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">How the winner is chosen</h3>
          <p>
            <strong className="font-normal text-ink">This is a game of skill.</strong>{' '}
            Chance plays no part in determining the winner.
          </p>
          <p className="mt-4">
            Every valid entry is read and judged by the Beauticate team. The
            winning entry will be the one that, in the judges&apos; opinion, most
            honestly and movingly answers why the entrant needs this escape.
            Judging takes place between {comp.judgingWindow}.
          </p>
          <p className="mt-4">
            One winner and two reserve entries are selected on the same basis and
            at the same time. The reserves are used, in the order they were
            selected, if the winner forfeits under the paragraph below.
          </p>
          <p className="mt-4">
            Before the prize is awarded, the Promoter will check that the winner
            met the entry conditions, including that they are following all
            three accounts and tagged two separate friends. The Promoter checks
            this for the winner and the reserves only, not for every entrant.
          </p>
          <p className="mt-4">
            The winner will be notified by email within two business days of
            being selected, and must respond within 48 hours of that email being
            sent. The Promoter may also follow up by Instagram direct message,
            but the email is the notification and the 48 hours run from it. If
            the winner does not respond within 48 hours, cannot be contacted, or
            is found to be ineligible, that entry is forfeited and the prize goes
            to the first reserve, then the second.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-xl text-ink mb-4">
            Your email address and what we do with it
          </h3>
          <p>
            Entering asks for your email address, so that we can tell you if you
            have won. Those messages are handled by ManyChat, an automated
            messaging service, and your email address is stored there and in our
            email platform.
          </p>
          <p className="mt-4">
            Giving us your email address is voluntary, but we cannot tell you
            that you have won without it.
          </p>
          <p className="mt-4">
            <strong className="font-normal text-ink">
              Entering subscribes you to email marketing from both Beauticate and
              Escape Haven
            </strong>
            , and your email address is given to {comp.partner} for that purpose.
            You can unsubscribe from either at any time using the link at the
            bottom of any email, and we will stop. Your entry does not depend on
            staying subscribed to either.
          </p>
          <p className="mt-4">
            {comp.partner} is based in Indonesia, so entering means your email
            address is disclosed to a recipient outside Australia. ManyChat and
            our email platform also store data outside Australia. We handle
            personal information in accordance with the Australian Privacy
            Principles and our{' '}
            <a href="/privacy" className="text-ink hover:text-eucalypt transition-colors">privacy policy</a>,
            and we do not sell it.
          </p>
          <p className="mt-4">
            If you win, we will also share what {comp.partner} needs in order to
            book and run your retreat. We collect nothing for the two friends you
            tag.
          </p>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            THIS GIFT WITH PURCHASE (edit per brand; newest promotion first)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="pt-4 border-t border-camel/30">
          <p className="label-editorial mb-2">Running now</p>
          <h2 className="font-serif text-2xl text-ink">This gift with purchase</h2>
          <p className="text-sm text-charcoal/50 mt-1">
            The details specific to the gift with purchase currently running.
          </p>
        </div>

        <section className="rounded-lg bg-tile/60 border border-camel/30 p-6 md:p-8">
          <h3 className="font-serif text-xl text-ink mb-4">
            {gwp.brand} gift with purchase{' '}
            <span className="text-charcoal/40 font-normal">
              {gwp.status === 'open' ? '(now running)' : '(ended)'}
            </span>
          </h3>
          <dl className="space-y-3 text-[15px]">
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Promoter</dt>
              <dd>Beauticate, in partnership with {gwp.brand}</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">The gift</dt>
              <dd>{gwp.gift} ({gwp.giftValue})</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">To qualify</dt>
              <dd>Spend {gwp.minSpend} or more on {gwp.brand} products in a single order</dd>
            </div>
            <div>
              <dt className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40">Available</dt>
              <dd>While stocks last, from {gwp.started}</dd>
            </div>
          </dl>
        </section>

        <section>
          <p>
            The gift is added to your cart automatically once your order meets the minimum. You do
            not need a code. The minimum spend is measured on {gwp.brand} products only, not on your
            order total, so other brands in the same order do not count towards it. Gift cards do not
            count towards the minimum.
          </p>
          <p className="mt-4">
            One gift per order. Gifts are limited to the number the brand has funded and offered
            while stocks last, so the promotion may end before any date we have advertised. If your order no
            longer meets the minimum — because you remove or reduce an item before checking out —
            the gift is removed from your cart.
          </p>
          <p className="mt-4">
            The gift has no cash value and cannot be exchanged or returned for credit. The{' '}
            {gwp.gift} is also sold on its own at full price — it is the gift version, given free
            with a qualifying order, that is limited to this promotion. If the gift becomes
            unavailable we may substitute one of equal or greater value.
          </p>
          <p className="mt-4">
            Returns are handled under our{' '}
            <a href="/shop/refund-policy" className="text-ink hover:text-eucalypt transition-colors">Returns &amp; Refunds Policy</a>.
            If a return leaves your order below the minimum, please send the gift back with it. If
            you keep the gift, we may deduct its value from your refund — but never more than the
            refund itself, so a return will never leave you owing us money. This does not apply where
            an item is faulty, not as described, or your return is otherwise covered by the
            Australian Consumer Law: in those cases your refund is unaffected and you keep the gift.
          </p>
          <p className="mt-4">
            We may change or end the promotion at any time. Orders already placed are not
            affected.
          </p>
          <p className="mt-4">
            This is a gift with purchase, not a competition or prize draw. There is no element of
            chance and no entry: every order meeting the conditions above receives the gift while
            stocks last.
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
            The winner is notified by email within two business days of the
            draw. The Promoter may also follow up by Instagram direct message.
          </p>
          <p className="mt-4">
            The winner&apos;s Instagram handle, first name and general location
            may be announced on Beauticate&apos;s Instagram account and in the
            Beauticate newsletter.
          </p>
          <p className="mt-4">
            Where the winner does not respond within the period stated in Part
            One, cannot be contacted, or is found to be ineligible, that entry is
            forfeited and the prize passes to another entrant by whichever method
            Part One sets out for that competition, being a reserve where
            reserves were selected, or a redraw conducted electronically by the
            same method where the winner was drawn at random. Either way it
            happens within 5 business days, and the new winner is notified within
            two business days.
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
