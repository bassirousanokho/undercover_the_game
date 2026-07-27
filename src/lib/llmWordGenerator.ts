import type { WordPair } from './types'
import { pickWordPair } from './wordBank'

export async function generateWordPair(theme?: string): Promise<{ wordPair: WordPair; usedFallback: boolean }> {
  try {
    const res = await fetch('/api/generate-word-pair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme }),
    })
    if (!res.ok) throw new Error('generation_failed')
    const data = await res.json()
    if (!data.wordPair) throw new Error('malformed')
    return { wordPair: data.wordPair as WordPair, usedFallback: false }
  } catch {
    return { wordPair: pickWordPair(theme), usedFallback: true }
  }
}
