import { describe, expect, it } from 'vitest'
import { checkImmediateWin } from '../winConditions'
import type { Player } from '../types'

function makePlayer(id: string, role: Player['role'], alive: boolean): Player {
  return { id, name: id, role, word: role === 'mrwhite' ? null : 'x', alive, hasSeenWord: false }
}

describe('checkImmediateWin', () => {
  it('declares undercover winner when it is one of the last 2 alive, even if mrwhite already failed', () => {
    const players = [
      makePlayer('civ1', 'civilian', true),
      makePlayer('uc', 'undercover', true),
      makePlayer('mw', 'mrwhite', false),
      makePlayer('civ2', 'civilian', false),
    ]
    expect(checkImmediateWin(players)).toBe('undercover')
  })

  it('declares civilians winner when both special roles are eliminated', () => {
    const players = [
      makePlayer('civ1', 'civilian', true),
      makePlayer('civ2', 'civilian', true),
      makePlayer('uc', 'undercover', false),
      makePlayer('mw', 'mrwhite', false),
    ]
    expect(checkImmediateWin(players)).toBe('civilians')
  })

  it('returns null when the game should continue', () => {
    const players = [
      makePlayer('civ1', 'civilian', true),
      makePlayer('civ2', 'civilian', true),
      makePlayer('uc', 'undercover', true),
      makePlayer('mw', 'mrwhite', true),
    ]
    expect(checkImmediateWin(players)).toBeNull()
  })

  it('does not declare undercover winner if the last 2 alive are civilian + mrwhite', () => {
    const players = [
      makePlayer('civ1', 'civilian', true),
      makePlayer('mw', 'mrwhite', true),
      makePlayer('uc', 'undercover', false),
      makePlayer('civ2', 'civilian', false),
    ]
    expect(checkImmediateWin(players)).toBeNull()
  })

  it('prioritizes undercover-last-2 over civilians-win when both could seemingly apply', () => {
    const players = [
      makePlayer('uc', 'undercover', true),
      makePlayer('civ1', 'civilian', true),
      makePlayer('mw', 'mrwhite', false),
    ]
    expect(checkImmediateWin(players)).toBe('undercover')
  })
})
