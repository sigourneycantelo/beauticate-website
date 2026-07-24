import fs from 'fs'
import path from 'path'

const VOICE_DIR = path.join(process.cwd(), 'docs', 'voice')

let _voicePrompt: string | null = null

export function getVoicePrompt(): string {
  if (_voicePrompt) return _voicePrompt

  const parts: string[] = []

  const sigChatPath = path.join(process.cwd(), 'docs', 'sig-chat-voice.md')
  if (fs.existsSync(sigChatPath)) {
    parts.push(fs.readFileSync(sigChatPath, 'utf-8'))
  } else {
    const sigVoice = path.join(VOICE_DIR, 'sigourney-voice.md')
    if (fs.existsSync(sigVoice)) {
      parts.push(fs.readFileSync(sigVoice, 'utf-8'))
    }

    const houseVoice = path.join(VOICE_DIR, 'beauticate-voice.md')
    if (fs.existsSync(houseVoice)) {
      parts.push(fs.readFileSync(houseVoice, 'utf-8'))
    }
  }

  const socialVoice = path.join(VOICE_DIR, 'social-voice-patterns.md')
  if (fs.existsSync(socialVoice)) {
    parts.push(fs.readFileSync(socialVoice, 'utf-8'))
  }

  _voicePrompt = parts.join('\n\n---\n\n')
  return _voicePrompt
}
