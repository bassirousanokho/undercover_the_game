import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import type { WordPair } from '@/lib/types'

const SCHEMA_HINT = `Return ONLY a JSON object with this exact shape, no prose, no markdown fences:
{"civilian": {"fr": "...", "en": "..."}, "undercover": {"fr": "...", "en": "..."}}`

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'no_api_key' }, { status: 501 })
  }

  const body = await request.json().catch(() => ({}))
  const theme: string | undefined = typeof body?.theme === 'string' ? body.theme : undefined

  const prompt = theme
    ? `Invent one pair of single/short words for the party game Undercover, on the theme "${theme}". The two words must be close in meaning but clearly distinct (one for civilians, one for the undercover player), each provided in both French and English. ${SCHEMA_HINT}`
    : `Invent one pair of single/short words for the party game Undercover. The two words must be close in meaning but clearly distinct (one for civilians, one for the undercover player), each provided in both French and English. ${SCHEMA_HINT}`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = message.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'no_text_response' }, { status: 502 })
    }

    const parsed = JSON.parse(textBlock.text.trim())
    if (!parsed?.civilian?.fr || !parsed?.civilian?.en || !parsed?.undercover?.fr || !parsed?.undercover?.en) {
      return NextResponse.json({ error: 'malformed_response' }, { status: 502 })
    }

    const wordPair: WordPair = {
      id: `ai-${Date.now()}`,
      theme: theme ?? 'ai',
      civilian: { fr: parsed.civilian.fr, en: parsed.civilian.en },
      undercover: { fr: parsed.undercover.fr, en: parsed.undercover.en },
    }

    return NextResponse.json({ wordPair })
  } catch {
    return NextResponse.json({ error: 'generation_failed' }, { status: 502 })
  }
}
