import { describe, expect, it } from 'vitest'
import { assignRoles, buildSeatOrder, buildTurnOrder, defaultRoleCounts, isRoleCountValid } from '../roleAssignment'
import type { Player, WordPair } from '../types'

const wordPair: WordPair = {
  id: 'cat-lion',
  theme: 'animals',
  civilian: { fr: 'Chat', en: 'Cat' },
  undercover: { fr: 'Lion', en: 'Lion' },
}

describe('defaultRoleCounts', () => {
  it('uses 1 undercover + 1 mrwhite for small groups', () => {
    expect(defaultRoleCounts(3)).toEqual({ undercover: 1, mrwhite: 1 })
    expect(defaultRoleCounts(7)).toEqual({ undercover: 1, mrwhite: 1 })
  })

  it('scales to 2 undercover for 8-11 players', () => {
    expect(defaultRoleCounts(8)).toEqual({ undercover: 2, mrwhite: 1 })
    expect(defaultRoleCounts(11)).toEqual({ undercover: 2, mrwhite: 1 })
  })

  it('scales to 2 undercover + 2 mrwhite for 12+', () => {
    expect(defaultRoleCounts(12)).toEqual({ undercover: 2, mrwhite: 2 })
  })
})

describe('isRoleCountValid', () => {
  it('rejects configs that leave zero civilians', () => {
    expect(isRoleCountValid(3, { undercover: 1, mrwhite: 2 })).toBe(false)
    expect(isRoleCountValid(3, { undercover: 1, mrwhite: 1 })).toBe(true)
  })
})

describe('assignRoles', () => {
  const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']

  it('assigns exactly the requested number of each role', () => {
    const players = assignRoles(names, { undercover: 1, mrwhite: 1 }, wordPair, 'en')
    expect(players.filter((p) => p.role === 'undercover')).toHaveLength(1)
    expect(players.filter((p) => p.role === 'mrwhite')).toHaveLength(1)
    expect(players.filter((p) => p.role === 'civilian')).toHaveLength(3)
  })

  it('gives civilians and undercover their respective words, and mrwhite no word', () => {
    const players = assignRoles(names, { undercover: 1, mrwhite: 1 }, wordPair, 'en')
    for (const p of players) {
      if (p.role === 'civilian') expect(p.word).toBe('Cat')
      if (p.role === 'undercover') expect(p.word).toBe('Lion')
      if (p.role === 'mrwhite') expect(p.word).toBeNull()
    }
  })

  it('preserves player names and order-independent uniqueness of ids', () => {
    const players = assignRoles(names, { undercover: 1, mrwhite: 1 }, wordPair, 'fr')
    expect(players.map((p) => p.name)).toEqual(names)
    expect(new Set(players.map((p) => p.id)).size).toBe(names.length)
  })

  it('never produces negative civilian counts even at the edge (3 players)', () => {
    const players = assignRoles(['A', 'B', 'C'], { undercover: 1, mrwhite: 1 }, wordPair, 'en')
    expect(players.filter((p) => p.role === 'civilian')).toHaveLength(1)
  })
})

describe('buildSeatOrder', () => {
  it('never starts the seat order with a Mr. White', () => {
    const players: Player[] = [
      { id: 'a', name: 'A', role: 'mrwhite', word: null, alive: true, hasSeenWord: false },
      { id: 'b', name: 'B', role: 'civilian', word: 'x', alive: true, hasSeenWord: false },
      { id: 'c', name: 'C', role: 'undercover', word: 'y', alive: true, hasSeenWord: false },
    ]
    for (let i = 0; i < 50; i++) {
      const order = buildSeatOrder(players)
      const first = players.find((p) => p.id === order[0])
      expect(first?.role).not.toBe('mrwhite')
    }
  })

  it('includes every player exactly once', () => {
    const players: Player[] = [
      { id: 'a', name: 'A', role: 'civilian', word: 'x', alive: true, hasSeenWord: false },
      { id: 'b', name: 'B', role: 'civilian', word: 'x', alive: true, hasSeenWord: false },
      { id: 'c', name: 'C', role: 'undercover', word: 'y', alive: true, hasSeenWord: false },
    ]
    const order = buildSeatOrder(players)
    expect(new Set(order)).toEqual(new Set(players.map((p) => p.id)))
  })
})

describe('buildTurnOrder', () => {
  const players: Player[] = [
    { id: 'a', name: 'A', role: 'civilian', word: 'x', alive: true, hasSeenWord: false },
    { id: 'b', name: 'B', role: 'undercover', word: 'y', alive: false, hasSeenWord: false },
    { id: 'c', name: 'C', role: 'mrwhite', word: null, alive: true, hasSeenWord: false },
    { id: 'd', name: 'D', role: 'civilian', word: 'x', alive: true, hasSeenWord: false },
  ]
  const seatOrder = ['a', 'b', 'c', 'd']

  it('filters out eliminated players', () => {
    const order = buildTurnOrder(seatOrder, 0, players)
    expect(order).toEqual(['a', 'c', 'd'])
  })

  it('rotates the starting point while preserving relative order', () => {
    const order = buildTurnOrder(seatOrder, 2, players)
    expect(order).toEqual(['c', 'd', 'a'])
  })
})
