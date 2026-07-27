import { describe, expect, it } from 'vitest'
import { applyWinToScores } from '../scoring'
import type { Player } from '../types'

function makePlayer(name: string, role: Player['role']): Player {
  return { id: name, name, role, word: role === 'mrwhite' ? null : 'x', alive: true, hasSeenWord: false }
}

describe('applyWinToScores', () => {
  const players = [
    makePlayer('Alice', 'civilian'),
    makePlayer('Bob', 'civilian'),
    makePlayer('Carol', 'undercover'),
    makePlayer('Dave', 'mrwhite'),
  ]

  it('gives +1 to every civilian when civilians win', () => {
    const scores = applyWinToScores(players, 'civilians', {})
    expect(scores).toEqual({ Alice: 1, Bob: 1 })
  })

  it('gives +1 to the undercover(s) when undercover wins', () => {
    const scores = applyWinToScores(players, 'undercover', {})
    expect(scores).toEqual({ Carol: 1 })
  })

  it('gives +1 to mrwhite when mrwhite wins', () => {
    const scores = applyWinToScores(players, 'mrwhite', {})
    expect(scores).toEqual({ Dave: 1 })
  })

  it('accumulates on top of existing scores across games', () => {
    const scores = applyWinToScores(players, 'civilians', { Alice: 2, Carol: 5 })
    expect(scores).toEqual({ Alice: 3, Bob: 1, Carol: 5 })
  })

  it('returns scores unchanged when there is no winner yet', () => {
    expect(applyWinToScores(players, null, { Alice: 1 })).toEqual({ Alice: 1 })
  })

  it('credits every undercover when there are multiple', () => {
    const bigGroup = [
      makePlayer('A', 'undercover'),
      makePlayer('B', 'undercover'),
      makePlayer('C', 'civilian'),
    ]
    expect(applyWinToScores(bigGroup, 'undercover', {})).toEqual({ A: 1, B: 1 })
  })
})
