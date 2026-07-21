'use client'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

function renderMarkdownLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/)
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (match) {
      return (
        <a
          key={i}
          href={match[2]}
          target={match[2].startsWith('http') ? '_blank' : undefined}
          rel={match[2].startsWith('http') ? 'noopener noreferrer' : undefined}
          className="underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          {match[1]}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function renderContent(text: string) {
  const paragraphs = text.split(/\n\n+/)
  return paragraphs.map((p, i) => {
    const lines = p.split('\n')
    return (
      <p key={i} className={i > 0 ? 'mt-2' : ''}>
        {lines.map((line, j) => (
          <span key={j}>
            {j > 0 && <br />}
            {renderMarkdownLinks(line)}
          </span>
        ))}
      </p>
    )
  })
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-sans leading-relaxed ${
          isUser
            ? 'bg-wine text-white rounded-br-md'
            : 'bg-greige text-chocolate rounded-bl-md'
        }`}
      >
        {renderContent(content)}
      </div>
    </div>
  )
}
