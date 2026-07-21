interface Props {
  children: React.ReactNode
}

export default function EditorIntro({ children }: Props) {
  return (
    <div className="not-prose my-10 mx-auto max-w-[600px] text-center">
      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-wine mb-4">
        Editor&rsquo;s Note
      </p>
      <div
        className="font-serif italic text-charcoal-light leading-relaxed"
        style={{ fontSize: 'clamp(15px, 1.8vw, 17px)' }}
      >
        {children}
      </div>
    </div>
  )
}
