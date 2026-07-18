const earningActions = [
  { action: 'Every A$1 spent', points: '5 points' },
  { action: 'Join the club or make your first purchase', points: '500 points' },
  { action: 'Refer a friend who buys', points: '1,000 points' },
  { action: 'Photo review via Judge.me', points: '250 points' },
  { action: 'Attend a Beauticate event', points: '500 points' },
  { action: 'Tag Beauticate on Instagram (verified)', points: '100 points' },
  { action: 'Follow on Instagram (one-off, verified)', points: '100 points' },
]

export default function WaysToEarn() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-content mx-auto">
        <div className="text-center mb-14">
          <span className="block font-sans text-[11px] tracking-[0.34em] uppercase font-medium opacity-50 mb-3">
            Ways to Earn
          </span>
          <h2
            className="font-serif font-normal"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
          >
            Status comes from belonging.
          </h2>
          <p className="font-serif mt-4 opacity-70 text-[15px] max-w-[500px] mx-auto leading-relaxed">
            Points build through shopping, engaging and showing up.
            Social actions are small, one-off earners. The real climb comes
            from being part of it.
          </p>
        </div>

        <div className="border-t border-line">
          {earningActions.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-baseline py-4 border-b border-line"
            >
              <span className="font-serif text-[15px] opacity-80">
                {item.action}
              </span>
              <span className="font-sans text-[12px] tracking-wide uppercase opacity-50 ml-4 shrink-0">
                {item.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
