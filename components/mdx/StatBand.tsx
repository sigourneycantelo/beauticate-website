interface Props {
  children: React.ReactNode
}

export function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center min-w-[120px]">
      <span
        className="block font-display text-chocolate leading-none"
        style={{ fontSize: 'clamp(48px, 8vw, 80px)', letterSpacing: '-0.03em' }}
      >
        {number}
      </span>
      <span
        className="block font-sans text-[10px] tracking-[0.25em] uppercase mt-3"
        style={{ color: '#9a9190' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function StatBand({ children }: Props) {
  return (
    <div className="not-prose my-12 border-t border-b border-cream-200 py-10">
      <div
        className="flex flex-wrap justify-center gap-x-16 gap-y-8"
        style={{ maxWidth: '720px', margin: '0 auto' }}
      >
        {children}
      </div>
    </div>
  )
}
