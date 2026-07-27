import type { Player, Winner } from './types'

const WINNING_ROLE = {
  civilians: 'civilian',
  undercover: 'undercover',
  mrwhite: 'mrwhite',
} as const

export function applyWinToScores(
  players: Player[],
  winner: Winner,
  scores: Record<string, number>,
): Record<string, number> {
  if (!winner) return scores

  const winningRole = WINNING_ROLE[winner]
  const next = { ...scores }
  for (const player of players) {
    if (player.role === winningRole) {
      next[player.name] = (next[player.name] ?? 0) + 1
    }
  }
  return next
}
