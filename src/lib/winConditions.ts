import type { Player, Winner } from './types'

/**
 * Checks win conditions that depend only on current board state (not on a
 * Mr. White guess, which is resolved separately). Must be called after every
 * elimination / failed Mr. White guess, in this precedence:
 *  1. Undercover is one of exactly 2 players left alive -> undercover wins.
 *  2. No undercover and no Mr. White left alive -> civilians win.
 */
export function checkImmediateWin(players: Player[]): Winner {
  const alive = players.filter((p) => p.alive)

  if (alive.length === 2 && alive.some((p) => p.role === 'undercover')) {
    return 'undercover'
  }

  const hasUndercover = alive.some((p) => p.role === 'undercover')
  const hasMrWhite = alive.some((p) => p.role === 'mrwhite')
  if (!hasUndercover && !hasMrWhite) {
    return 'civilians'
  }

  return null
}
