export default function AccountDashboard() {
  return (
    <div className="max-w-wide mx-auto px-4 py-12">
      <h1 className="mb-8">My Account</h1>

      <section className="border border-line p-6 md:p-8 mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-[20px]">Members&rsquo; Club</h2>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase opacity-50">
            The Edit
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-numeral text-[36px] leading-none">0</span>
          <span className="font-sans text-[12px] tracking-wide uppercase opacity-50">
            points
          </span>
        </div>

        <p className="font-serif text-[14px] opacity-60 leading-relaxed">
          Your points and tier will appear here once the Members&rsquo; Club goes live.
          Keep shopping and they&rsquo;ll be waiting for you.
        </p>
      </section>

      <p className="font-sans text-[12px] opacity-40">
        Powered by Smile.io. Connected to your shop account.
      </p>
    </div>
  )
}
