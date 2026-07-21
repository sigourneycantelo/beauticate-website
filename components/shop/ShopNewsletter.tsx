import NewsletterForm from '@/components/shared/NewsletterForm'

export default function ShopNewsletter() {
  return (
    <section
      className="text-center"
      style={{ background: '#FBF9F4', borderTop: '1px solid rgba(28,26,23,.10)', padding: 'clamp(52px,6vw,84px) clamp(20px,6vw,104px)' }}
    >
      <p className="font-sans" style={{ fontSize: '11px', letterSpacing: '0.34em', textTransform: 'uppercase', opacity: 0.5 }}>
        Join the list
      </p>
      <h2 className="font-serif font-normal mt-3" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>
        The edit, in your <em className="italic">inbox</em>.
      </h2>
      <p className="font-serif mx-auto mt-4 max-w-[52ch]" style={{ fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.6, opacity: 0.72 }}>
        The products our editors and the Beauticate Collective are reaching for right now. Chosen by
        people who&rsquo;ve spent decades knowing the difference. No noise, just the good stuff.
      </p>
      <p className="font-serif italic mt-3" style={{ fontSize: 'clamp(14px,1.4vw,17px)', opacity: 0.6 }}>
        We email like we edit. Sparingly, and only when it&rsquo;s worth it.
      </p>

      <div className="flex justify-center mt-7">
        <NewsletterForm variant="light" />
      </div>
    </section>
  )
}
