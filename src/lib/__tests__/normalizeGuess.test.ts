import { describe, expect, it } from 'vitest'
import { isGuessCorrect, normalizeWord } from '../normalizeGuess'

describe('normalizeWord', () => {
  it('strips accents, case, and punctuation', () => {
    expect(normalizeWord('Château!')).toBe('chateau')
    expect(normalizeWord('  Café  ')).toBe('cafe')
  })

  it('collapses internal whitespace', () => {
    expect(normalizeWord('Train   station')).toBe('train station')
  })
})

describe('isGuessCorrect', () => {
  it('matches regardless of case, accents, or surrounding whitespace', () => {
    expect(isGuessCorrect('chateau', 'Château')).toBe(true)
    expect(isGuessCorrect('  CAFÉ ', 'café')).toBe(true)
  })

  it('rejects genuinely different words', () => {
    expect(isGuessCorrect('chien', 'chat')).toBe(false)
  })
})
